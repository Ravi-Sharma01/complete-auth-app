const express = require('express');
const router = express.Router();
const {registerUser, verifyEmail} = require('../controllers/auth.controller')

router.post('/registerUser', registerUser);
router.get('/verify-email/:token', verifyEmail);






module.exports = router