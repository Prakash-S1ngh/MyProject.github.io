const multer = require('multer');

// Configure storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb takes two arguments: (error, destination)
        cb(null, './uploadimages/course'); // No error, set destination folder
    },
    filename: (req, file, cb) => {
        // cb takes two arguments: (error, filename)
        cb(null, `${Date.now()}-${file.originalname}`); // No error, set filename with timestamp
    }
});

// Create multer instance with the storage configuration
const upload = multer({ storage });

// Export the configured multer object
module.exports = upload;
