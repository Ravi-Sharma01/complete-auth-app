const express = require('express');
const router = express.Router();
const {
    registerUser, 
    verifyEmail, 
    loginUser, 
    resendEmail,
    logoutUser,
    currentUser,
    forgetPassword,
    resetPassword,
    renewAcessToken} = require('../controllers/auth.controller');

router.post('/registerUser', registerUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-email',resendEmail);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/user', currentUser)
router.post('/refresh-token', renewAcessToken)
router.post('/forget-password', forgetPassword)
router.post('/reset-password', resetPassword)


module.exports = router