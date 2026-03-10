const express = require('express');
const router = express.Router();
const {
    registerUser, 
    verifyEmail, 
    loginUser, 
    resendVerifyEmail} = require('../controllers/auth.controller');

router.post('/registerUser', registerUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-email',resendVerifyEmail);
router.post('/login', loginUser);






module.exports = router