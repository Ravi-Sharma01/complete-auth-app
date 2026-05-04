const express = require('express')
const connectDB = require('./config/db.config')
const authRoutes = require('./routers/auth.routes')
const cookieParser = require('cookie-parser')


const app = express();
connectDB();
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.get('/',(req, res)=>{
    res.send('server started');
})


module.exports = app;