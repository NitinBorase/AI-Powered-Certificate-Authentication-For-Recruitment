const mongoose = require('mongoose');

const ApplicantSchema = new mongoose.Schema({
    email : String,
    password : String
});

module.exports = mongoose.model('Applicant', ApplicantSchema);