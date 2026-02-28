require('dotenv').config()

module.exports = {
    app:{
        port : parseInt(process.env.PORT, 10) || 3000,
        env : process.env.NODE_ENV || 'devlopment'
    },
}