const mongoose = require('mongoose');

const ApplicantSchema = new mongoose.Schema({
    email : String,
    password : String,

    resumeUrl: { 
    type: String, 
    default: '' 
  },
  
    fileName: {
    type: String,
    default: 'Not uploaded'
    }
});

module.exports = mongoose.model('Applicant', ApplicantSchema);