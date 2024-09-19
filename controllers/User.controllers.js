const mongoose = require('mongoose');
const User = require('../models/User.models');
const OTP = require('../models/OTP.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { mailsending } = require('../config/mailsending.config');
const { secureHeapUsed } = require('crypto');
const { uploadOnCloudinary } = require('../config/cloudinary.config');
require('dotenv').config();

// Utility to generate OTP
const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    return otp.toString();
};

exports.signup = async (req, res) => {
    try {
        const { name, gender, mobnum, email, password, profession } = req.body;
        const images = req.file;
        console.log("this is req.files ->" , req.file);


        if (!name || !gender || !mobnum || !email || !password || !profession) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Check if user already exists
        const checkUser = await User.findOne({ email });
        console.log(checkUser);
        if (checkUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Generate a unique OTP
        let otpCode;
        let isUnique = false;

        while (!isUnique) {
            otpCode = generateOTP();
            const existingOTP = await OTP.findOne({ otpCode, isUsed: false });
            if (!existingOTP) {
                isUnique = true;
            }
        }

        // Send OTP via email
        await mailsending(email, otpCode);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const url = await uploadOnCloudinary(images.path , images);

        // Create new user (without saving to database until OTP is verified)
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            contactNum: mobnum,
            gender,
            profession,
            profileImage:url.url
        });

        if (!newUser) {
            return res.status(400).json({
                success: false,
                message: "Failed to create user"
            });
        }

        // Save OTP in the OTP collection
        await OTP.create({
            userId: newUser._id,
            otpCode,
            expiresAt: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
            isUsed: false
        });

        // Generate JWT token
        const token = jwt.sign(
            { _id: newUser._id, email: newUser.email },
            process.env.SECRET_KEY, // Make sure you have the secret key in .env
            { expiresIn: '1h' }
        );

        // Set token as a cookie
        res.cookie("token", token, {
            httpOnly: true,
            samesite : "none",
            secure : "none",
        })

        return res.status(200).json({token})

    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during signup",
            error
        });
    }
};
exports.verifyOtp = async (req, res) => {
    try {
        const { _id } = req.user;
        const { otp } = req.body;
    
        if(!otp){
            return res.status(400).json({
                success:false,
                message:"The otp is not fetched"
            });
        }

        // Find the OTP entry for the user
        const findOtp = await OTP.findOne({ userId: _id, isUsed: false });
        console.log(otp);

        if (!findOtp) {
            return res.status(400).json({
                success: false,
                message: "OTP not found for this user"
            });
        }

        // Check if OTP matches
        if (otp !== findOtp.otpCode) {
            // const deleteUser = await User.findByIdAndDelete(_id);
            return res.status(400).json({
                success: false,
                message: "Incorrect OTP"
            });
        }

        // Mark OTP as used
        findOtp.isUsed = true;
        await findOtp.save();

        // Fetch the user to return
        const newUser = await User.findById(_id);
        if (!newUser) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP verified. User created successfully.",
            newUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while verifying OTP",
            error
        });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { password, email } = req.body;
        if (!password || !email) {
            return res.status(404).json({
                success: false,
                message: "The login credentials are required"
            });
        }

        const checkUser = await User.findOne({ email: email });
        if (!checkUser) {
            return res.status(400).json({
                success: false,
                message: "The user does not exist"
            });
        }

        const passcheck = await bcrypt.compare(password, checkUser.password);
        if (!passcheck) {
            return res.status(400).json({
                success: false,
                message: "The password is incorrect"
            });
        }

        const token = jwt.sign(
            { email: email, _id: checkUser._id },
            process.env.SECRET_KEY,
            { expiresIn: "2h" }
        );

        const option = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        return res.cookie("token", token, option).json({
            message: "User logged in successfully",
            checkUser
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "An error occurred in login module"
        });
    }
};

//use authorization middleware for this in route
exports.deleteUser = async (req, res) => {
    try {
        // The authenticated user's ID is available through req.user
        const userId = req.user._id;

        // Find the user by ID and delete
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message
        });

    }
}

exports.changepassword = async (req, res) => {
    try {
        const { currentPass, newPass } = req.body;
        if (!currentPass || !newPass) {
            return res.status(400).json({
                success: false,
                message: "Both current and new passwords are required"
            });
        }

        const userId = req.user._id;


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        const isMatch = await bcrypt.compare(currentPass, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }


        const hashPass = await bcrypt.hash(newPass, 10);


        user.password = hashPass;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while changing the password",
            error: error.message
        });
    }
};