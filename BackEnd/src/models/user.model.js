const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, 'please add a name']
    },

    email:{
        type:String,
        required:[true, 'please add a email'],
        unique:true
    },

    password:{
        type:String,
        required:[true, 'password is required']
    },

    
},
{
    timestamps:true
})


userSchema.pre("save", async function(){
    if(!this.isModified('password')) return

    try{
        const salt = await bcrypt.hash(this.password, 10);
        this.password = salt;
        
    }catch(err){
        console.log(err);
    }
})


const User = mongoose.model("User", userSchema);

module.exports = User;