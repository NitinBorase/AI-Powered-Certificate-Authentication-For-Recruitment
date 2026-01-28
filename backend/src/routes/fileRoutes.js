const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const { updateResume } = require('../controllers/userControllers');
const { getUserProfile } = require('../controllers/userControllers');

const upload = multer({ storage});

router.post('/uploadResume', upload.single('resume'), (req, res) => {
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

router.post('/update-db', updateResume);
router.get('/profile', getUserProfile);

module.exports = router;