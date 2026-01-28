const Applicant = require('../models/Applicant');

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
                fileName: user.fileName
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch user profile", error: error.message });
    }
};