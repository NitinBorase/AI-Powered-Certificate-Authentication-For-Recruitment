const bcrypt = require('bcryptjs');
const Applicant = require('../models/Applicant');
const Employer = require('../models/Employer');
const Institution = require('../models/Institution');

exports.registerUser = async(req, res) => {
    try{
        const { email, password, role, institutionName, companyName } =  req.body;

        if(!email || !password || !role){
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser;

        if(role.toLowerCase() === 'applicant'){
            newUser = new Applicant({email, password: hashedPassword});
        } else if(role.toLowerCase() === 'employer'){
            newUser = new Employer({companyName, email, password: hashedPassword});
        } else if(role.toLowerCase() === 'institution'){
            newUser = new Institution({institutionName, email, password: hashedPassword});
        } else{
            return res.status(400).json({ message: 'Invalid role specified' });
        }
        await newUser.save();

        res.status(201).json({ message: `${role} User registered successfully` });
    }
    catch(err){
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};