const cloudinary = require('cloudinary').v2;  // Ensure you're using v2 of the Cloudinary SDK
require('dotenv').config();  // Load environment variables

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload to Cloudinary
exports.uploadOnCloudinary = async (filePath, options = {}) => {
    try {
        console.log("this is the file path",filePath);
        console.log("this clooudinary");
        const result = await cloudinary.uploader.upload(filePath, {
            folder: options.folder || 'New file', // Default folder
            resource_type: options.resource_type || 'auto', // Automatically detect resource type
            transformation: options.transformation || [] // Optional transformations for croping , editing size
        });
        return result; 
    } catch (error) {
        console.error("An error occurred while uploading to Cloudinary:", error); 
        throw error; // Re-throw the error to be handled by the calling code
    }
};
