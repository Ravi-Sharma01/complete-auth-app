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
    },
    jwt:{
        secret:process.env.SECRET_KEY || 'fallback_secret',
        expiresIn:process.env.SECRET_EXPIRES_IN || '15m',
        refreshSecret:process.env.REFRESH_SECRET_KEY || 'falback_refresh_secret',
        refreshExpires:process.env.REFRESH_SECRET_EXPIRES_IN || '30d'
    }
}