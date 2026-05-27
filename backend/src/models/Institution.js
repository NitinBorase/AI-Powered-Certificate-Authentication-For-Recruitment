// models/Institution.js
const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    hashId: { type: String, default: 'None' } // Defaults to 'None' as requested
});

const InstitutionSchema = new mongoose.Schema({
    institutionName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    certificates: [CertificateSchema] // Array to store uploaded certificates
});

module.exports = mongoose.model('Institution', InstitutionSchema);