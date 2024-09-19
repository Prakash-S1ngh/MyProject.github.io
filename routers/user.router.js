const express = require('express');
const router = express.Router(); 
const { signup, loginUser, verifyOtp } = require('../controllers/User.controllers');
const { authorization } = require('../middleware/auth.middleware');
const upload = require('../middleware/fileuploading.middleware');

router.post('/signup' , upload.single('images'), signup); 
router.post('/signup/verifyotp',authorization,verifyOtp);
router.route('/login').post(loginUser); 

module.exports = router;
