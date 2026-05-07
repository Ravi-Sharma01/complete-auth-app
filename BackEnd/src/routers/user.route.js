const express = require('express');
const isAuthenticated = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.get('/user', isAuthenticated, authorize("user", "admin", "manager"), (req, res)=>{
    res.status(200).json({message: 'welcome user'});
})
router.get('/manager',isAuthenticated, authorize("admin", "manager"),(req, res)=>{
    res.status(200).json({
        message: "welcome manager"
    })
})
router.get('/admin',isAuthenticated, authorize("admin"),(req, res)=>{
    res.status(200).json({
        message: "welcome admin"
    })
})

module.exports = router;