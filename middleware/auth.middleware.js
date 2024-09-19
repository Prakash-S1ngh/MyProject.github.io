const jwt = require('jsonwebtoken');
const User = require('../models/User.models');
require('dotenv').config();

exports.authorization = async (req, res, next) => {
    try {
        // console.log("hi bro");
        // console.log(req.cookies);

        const { token } = req.cookies; // Get the token from cookies
        // console.log(token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found in cookie"
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify the token

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        const { _id, email } = decoded;  // Destructure _id (not userid)
        const user = await User.findById(_id);  // Use _id to find the user

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;  // Attach the user object to the request for use in the next middleware
        next();  // Proceed to the next middleware

    } catch (error) {
        console.error("Authorization error:", error);
        return res.status(500).json({
            success: false,
            message: "Authorization middleware failed",
            error: error.message
        });
    }
};
