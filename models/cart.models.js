const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    cartItems:[{
        type:mongoose.Types.ObjectId,
        ref:"Courses"
    }]

});

exports.Cart = mongoose.model("Cart",cartSchema);
