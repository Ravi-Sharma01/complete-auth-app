const express = require('express')
const authRoutes = require('./routers/auth.route')
const userRoutes = require('./routers/user.route');
const cookieParser = require('cookie-parser')
const cors = require('cors')



const corsOption ={
    origin:'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus : 200
};
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));



app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.get('/',(req, res)=>{
    res.send('server started');
})


module.exports = app;