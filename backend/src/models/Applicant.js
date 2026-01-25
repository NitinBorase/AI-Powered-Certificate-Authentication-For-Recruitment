const moongoose = require('mongoose');

const ApplicantSchema = new moongoose.Schema({
    email : String,
    password : String
});

module.exports = moongoose.model('Applicant', ApplicantSchema);