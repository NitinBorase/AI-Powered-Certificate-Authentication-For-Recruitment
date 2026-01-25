const moongoose = require('mongoose');

const EmployerSchema = new moongoose.Schema({
    companyName : String,
    email : String,
    password : String
});

module.exports = moongoose.model('Employer', EmployerSchema);