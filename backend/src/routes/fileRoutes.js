const express = require('express');
const router = express.Router();
const multer = require('multer');
const { resumeStorage, certificateStorage } = require('../config/cloudinary');
const { updateResume, updateCertificate, getUserProfile } = require('../controllers/userControllers');

const uploadResume = multer({ storage: resumeStorage });
const uploadCertificate = multer({ storage: certificateStorage });

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

router.post('/update-db', updateResume);
router.post('/certificates/update-db', updateCertificate);
router.get('/profile', getUserProfile); 

module.exports = router;