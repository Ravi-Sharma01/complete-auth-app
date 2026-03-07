const mongoose = require('mongoose');
const {db} = require('./env.config');


const connectDB = async()=>{
    try{
        await mongoose.connect(db.uri);
        console.log('database connected succesfully');
    }catch(error){
        console.error(error);
    }
}

module.exports = connectDB;