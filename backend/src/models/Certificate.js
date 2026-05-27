const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
    hashId: { 
        type: String, 
        required: true, 
        unique: true, 
        index: true 
    },
    
    blockchainTxHash: { 
        type: String, 
        required: false // Optional until the blockchain transaction completes
    },
    
    institutionEmail: { 
        type: String, 
        required: true 
    },
    
    fileName: { 
        type: String, 
        required: true 
    },
    fileUrl: { 
        type: String, 
        required: true 
    },
    
    issueDate: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Certificate', CertificateSchema);