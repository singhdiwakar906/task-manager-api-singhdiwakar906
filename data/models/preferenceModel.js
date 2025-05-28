const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        unique: true },
    categories: { 
        type: [String], 
        default: [] 
    },
    languages: { 
        type: [String], 
        default: [] 
    }, 
    sources: { 
        type: [String], 
        default: [] 
    },   
    region: { 
        type: String, 
        default: 'IN' 
    }, 
}, { timestamps: true });

module.exports = mongoose.model('Preference', preferenceSchema);