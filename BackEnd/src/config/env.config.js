require('dotenv').config()

module.exports = {
    app:{
        port : parseInt(process.env.PORT, 10) || 3000,
        env : process.env.NODE_ENV || 'devlopment'
    },
    db:{
        uri:process.env.MONGO_URI
    },
    email:{
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT || 587,
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
        email_from:process.env.EMAIL_FROM,
    }
}