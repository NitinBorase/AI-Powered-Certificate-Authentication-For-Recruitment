const axios = require('axios');
const Applicant = require('../models/Applicant'); 

async function validateCertificateIntegrity(applicantId, certificateId) {
    try {
        const applicant = await Applicant.findById(applicantId);
        if (!applicant) throw new Error("Applicant not found");

        const certificate = applicant.certificates.id(certificateId);
        if (!certificate) throw new Error("Certificate not found");
        if (!certificate.url) throw new Error("No image URL to scan");

        const expectedName = applicant.email.split('@')[0];
        const expectedCourse = certificate.standardizedSkills.join(" ") || certificate.extractedText;

        console.log(`Verifying QR & Data for: ${certificate.fileName}...`);

        const safeImageUrl = certificate.url.replace(/\.pdf$/i, '.jpg');

        const pythonResponse = await axios.post('http://localhost:8000/verify-qr-and-data', {
            image_url: safeImageUrl,
            expected_name: expectedName,
            expected_course: expectedCourse
        });

        const result = pythonResponse.data;

        if (result.is_verified) {
            certificate.status = 'Verified';
            certificate.actionRequired = 'None';
        } else {
            certificate.status = 'Not Verified';
            certificate.actionRequired = `Manual Review: ${result.reason}`; 
        }

        await applicant.save();

        console.log(`Validation Complete: ${result.status} - ${result.reason}`);
        return certificate;

    } catch (error) {
        console.error("❌ Integrity Check Failed:", error.message);
        return null;
    }
}

module.exports = { validateCertificateIntegrity };