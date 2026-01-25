const moongoose = require('mongoose');

const InstitutionSchema = new moongoose.Schema({
    institutionName : String,
    email : String,
    password : String
});

module.exports = moongoose.model('Institution', InstitutionSchema);