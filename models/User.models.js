const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    contactNum: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    }
}, {timestamps: true});

// Corrected export
module.exports = mongoose.model("User", userSchema);
