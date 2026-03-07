const express = require('express')
const connectDB = require('./config/db.config')


const app = express();
connectDB();


app.get('/',(req, res)=>{
    res.send('server started');
})


module.exports = app;