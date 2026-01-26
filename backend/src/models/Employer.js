const mongoose = require('mongoose');

const EmployerSchema = new mongoose.Schema({
    companyName : String,
    email : String,
    password : String
});

module.exports = mongoose.model('Employer', EmployerSchema);