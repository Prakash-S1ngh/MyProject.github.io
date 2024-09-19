const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    courseImage: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: true,  
        ref: 'User'     
    },
    tag: {
        type: String,
        required: true    
    },
    profileImage:{
        required:true,
        type:String
    }
}, { timestamps: true }); 

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
