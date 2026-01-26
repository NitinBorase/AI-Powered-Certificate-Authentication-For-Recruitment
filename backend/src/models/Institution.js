const mongoose = require('mongoose');

const InstitutionSchema = new mongoose.Schema({
    institutionName : String,
    email : String,
    password : String
});

module.exports = mongoose.model('Institution', InstitutionSchema);