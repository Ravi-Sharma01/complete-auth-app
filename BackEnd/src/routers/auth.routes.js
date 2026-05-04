const express = require('express');
const router = express.Router();
const {
    registerUser, 
    verifyEmail, 
    loginUser, 
    resendVerifyEmail,
    logout,
    currentUser,
    renewAcessToken} = require('../controllers/auth.controller');

router.post('/registerUser', registerUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-email',resendVerifyEmail);
router.post('/login', loginUser);
router.get('/logout', logout);
router.get('/user', currentUser)
router.post('/refresh-token', renewAcessToken)


module.exports = router