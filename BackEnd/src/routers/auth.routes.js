const express = require('express');
const router = express.Router();
const {registerUser} = require('../controllers/auth.controller')

router.post('/registerUser', registerUser);






module.exports = router