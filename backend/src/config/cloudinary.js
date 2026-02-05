const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ai_certi_resumes',
    allowed_formats: ['pdf'],
  },
});

const certificateStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ai_certi_certificates',
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png'],
  },
});

module.exports = { cloudinary, resumeStorage, certificateStorage }; 