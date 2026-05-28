const { PdfReader } = require('pdfreader');
const express = require('express');
const router = express.Router();
const { validateAllCertificates } = require('../controllers/certificateController');
const Institution = require('../models/Institution');
const crypto = require('crypto');
const axios = require('axios');
const Certificate = require('../models/Certificate');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Stores file in RAM buffer temporarily

// POST route to trigger the bulk sweep
router.post('/admin/certificates/validate-all', async (req, res) => {
    try {
        validateAllCertificates()
            .then(stats => console.log("Background validation finished with stats:", stats))
            .catch(err => console.error("Background validation crashed:", err));

        res.status(200).json({ 
            success: true, 
            message: "Bulk validation started in the background. Check server logs for progress." 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to start validation process." });
    }
});

// POST: Extract Text, Generate Hash, & Save Certificate
router.post('/update-certificates', async (req, res) => {
    const { email, certificateUrl, fileName } = req.body;

    try {
        console.log(`Downloading PDF to extract text: ${fileName}...`);
        
        // 1. Fetch the PDF file from Cloudinary as a raw data buffer
        const pdfResponse = await axios.get(certificateUrl, { responseType: 'arraybuffer' });
        const pdfBuffer = Buffer.from(pdfResponse.data);
        
        // 2. Extract the text asynchronously using PdfReader
        let extractedText = "";
        
        await new Promise((resolve, reject) => {
            new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
                if (err) {
                    reject(err);
                } else if (!item) {
                    resolve(); // Triggers when the file parser hits EOF (End Of File)
                } else if (item.text) {
                    extractedText += item.text + " ";
                }
            });
        });

        extractedText = extractedText.trim();

        if (!extractedText) {
            return res.status(400).json({ 
                success: false, 
                message: 'No readable text found in PDF. Ensure it is a digital file, not an image scan.' 
            });
        }

        // 3. Generate the SHA-256 Hash using the extracted text
        const uniqueDataString = `${extractedText}`;
        const generatedHash = crypto.createHash('sha256').update(uniqueDataString).digest('hex');
        
        console.log(`Generated Hash for certificate: ${generatedHash}`);

        // 4. Save to the Global Certificate Schema
        const newGlobalCertificate = new Certificate({
            hashId: generatedHash,
            institutionEmail: email,
            fileName: fileName,
            fileUrl: certificateUrl
        });
        await newGlobalCertificate.save(); 

        // 5. Update the Institution's Dashboard Profile Array
        const newInstitutionCertificate = {
            fileName: fileName,
            fileUrl: certificateUrl,
            hashId: generatedHash 
        };

        const updatedInstitution = await Institution.findOneAndUpdate(
            { email: email },
            { $push: { certificates: newInstitutionCertificate } },
            { new: true } 
        );

        if (!updatedInstitution) {
            return res.status(404).json({ success: false, message: 'Institution not found' });
        }

        const addedCertificate = updatedInstitution.certificates[updatedInstitution.certificates.length - 1];
        res.json({ success: true, certificate: addedCertificate });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'This exact certificate content has already been issued.' });
        }
        console.error('Error processing certificate:', error);
        res.status(500).json({ success: false, message: 'Failed to extract text and save certificate' });
    }
});

router.get('/profile', async (req, res) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        
        // Find the specific institution by their email
        let institution = await Institution.findOne({ email: email });
        
        // Auto-create logic just in case the institution doesn't exist yet
        if (!institution) {
            console.log(`Institution ${email} not found. Auto-creating...`);
            institution = new Institution({
                institutionName: 'AI-CertiAuth Institute',
                email: email,
                password: 'defaultPassword123', 
                certificates: [] // Starts with an empty table
            });
            await institution.save();
        }

        // Send the data back to React so the table can populate!
        res.json({ success: true, institution: institution });
        
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching profile' });
    }
});

// POST: Verify a PDF certificate by extracting text and checking the Hash Registry
router.post('/verify-pdf-url', async (req, res) => {
    try {
        const { email, certificateUrl } = req.body;

        if (!certificateUrl || !email) {
            return res.status(400).json({ success: false, message: 'Missing email or certificate URL.' });
        }

        console.log(`Starting clean verification for URL: ${certificateUrl}...`);
        
        // 1. Fetch the PDF file from Cloudinary exactly like we do during issuance
        const pdfResponse = await axios.get(certificateUrl, { responseType: 'arraybuffer' });
        const pdfBuffer = Buffer.from(pdfResponse.data);
        
        // 2. Extract the text using the identical layout loop
        let extractedText = "";
        
        await new Promise((resolve, reject) => {
            new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
                if (err) {
                    reject(err);
                } else if (!item) {
                    resolve(); 
                } else if (item.text) {
                    extractedText += item.text + " ";
                }
            });
        });

        extractedText = extractedText.trim();

        if (!extractedText) {
            return res.status(400).json({ 
                success: false, 
                message: 'Could not read text content. Ensure it is a valid digital PDF.' 
            });
        }

        // 3. Generate the SHA-256 Hash using the identical blueprint pattern
        const uniqueDataString = `${extractedText}`;
        const generatedHash = crypto.createHash('sha256').update(uniqueDataString).digest('hex');
        
        console.log(`Generated Verification Hash: ${generatedHash}`);

        // 4. Search the Global Registry for a match
        const verifiedRecord = await Certificate.findOne({ hashId: generatedHash });

        // 5. Send back the Verdict
        if (!verifiedRecord) {
            return res.json({ 
                success: false, 
                isVerified: false,
                message: 'Verification Failed: This document has been tampered with or was never issued.' 
            });
        }

        // Perfect match found
        res.json({ 
            success: true, 
            isVerified: true,
            actionRequired: 'None | Verified By Blockchain',
            message: 'Certificate Authenticity Verified Successfully!',
            data: {
                fileName: verifiedRecord.fileName,
                institutionEmail: verifiedRecord.institutionEmail,
                issueDate: verifiedRecord.issueDate,
                hashId: verifiedRecord.hashId
            }
        });

    } catch (error) {
        console.error('Error during certificate verification processing:', error);
        res.status(500).json({ success: false, message: 'Internal server error during verification process.' });
    }
});

module.exports = router;