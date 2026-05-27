const express = require('express');
const router = express.Router();
const multer = require('multer');
const { resumeStorage, certificateStorage } = require('../config/cloudinary');
const { updateResume, updateCertificate, getUserProfile } = require('../controllers/userControllers');

const uploadResume = multer({ storage: resumeStorage });
const uploadCertificate = multer({ storage: certificateStorage });
const upload = multer({ storage: certificateStorage });

router.post('/uploadResume', uploadResume.single('resume'), (req, res) => {
    try{
        if(!req.file){
            return res.status(400).json({ message:'No file uploaded'});
        }

        res.status(200).json({
            success: true,
            message: 'Resume uploaded successfully',
            fileUrl: req.file.path
        })
    }
    catch(err){
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

router.post('/uploadCertificate', uploadCertificate.single('certificate'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.status(200).json({
      success: true,
      message: 'Certificate uploaded successfully',
      fileUrl: req.file.path
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

router.post('/uploadCertificate', upload.single('certificate'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // 3. Because you are using multer-storage-cloudinary, the file is ALREADY 
        // uploaded to Cloudinary by the time the code reaches here.
        // The secure URL is automatically available at req.file.path
        const fileUrl = req.file.path;
        
        console.log("Successfully uploaded to Cloudinary:", fileUrl);

        // 4. Send the real Cloudinary URL back to the React frontend
        res.json({ success: true, fileUrl: fileUrl });
        
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500).json({ success: false, message: 'Cloud upload failed' });
    }
});

router.post('/update-db', updateResume);
router.post('/certificates/update-db', updateCertificate);
router.get('/profile', getUserProfile); 

module.exports = router;