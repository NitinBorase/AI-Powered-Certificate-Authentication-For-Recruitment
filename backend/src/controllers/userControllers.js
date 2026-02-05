const Applicant = require('../models/Applicant');
const mongoose = require('mongoose');

exports.updateResume = async (req, res) => {
    try {
        const { email, resumeUrl, fileName } = req.body;

        if (!email || !resumeUrl) {
            console.log("Error: Missing email or URL in request");
            return res.status(400).json({ message: "Email and Resume URL are required" });
        }

        const updatedUser = await Applicant.findOne({ email });
        if (updatedUser) {
            updatedUser.resumeUrl = resumeUrl;
            updatedUser.fileName = fileName || updatedUser.fileName;
            await updatedUser.save();
        } else {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Database updated!", 
            user: updatedUser 
        });
    } catch (error) {
        res.status(500).json({ message: "DB Update failed", error: error.message });
    }
};

const formatDate = (date = new Date()) => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

exports.updateCertificate = async (req, res) => {
  try {
    const { email, certificateUrl, fileName } = req.body;

    if (!email || !certificateUrl) {
      return res.status(400).json({ message: 'Email and certificate URL are required' });
    }

    const user = await Applicant.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newCert = {
      id: new mongoose.Types.ObjectId().toString(),
      fileName: fileName || 'Unnamed Certificate',
      url: certificateUrl,
      status: 'Pending',
      uploadedDate: formatDate(),
      actionRequired: 'No Action Required'
    };

    user.certificates = user.certificates || [];
    user.certificates.unshift(newCert);
    await user.save();

    res.status(200).json({ success: true, certificate: newCert, user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update certificates', error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await Applicant.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            success: true,
            user: {
                email: user.email,
                resumeUrl: user.resumeUrl,
                fileName: user.fileName,
                certificates: user.certificates || []
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch user profile", error: error.message });
    }
};