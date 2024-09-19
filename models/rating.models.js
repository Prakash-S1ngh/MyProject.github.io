const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    courseId:{
        type:mongoose.Types.ObjectId,
        ref:"Courses"
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    count:{
        type:String,
        require:true
    }
});

exports.rating = mongoose.model("rating",ratingSchema);