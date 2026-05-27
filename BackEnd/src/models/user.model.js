const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { type } = require('os');

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
    isVerified:{
        type:Boolean,
        default:false
    },
    refreshToken:String,
    emailVerificationToken:String,
    emailVerificationTokenExpiresIn:Date,  

    role :{
        type : String,
        role : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Role'
        },
        required: false,
        default : 'user'
    }
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

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

userSchema.methods.generateEmailVerificationToken = async function(){
    const Token = crypto.randomBytes(32).toString('hex');
    this.emailVerificationToken = Token;
    this.emailVerificationTokenExpiresIn = Date.now() + 30 * 60 * 1000 // for 30 minutes
    await this.save();
    return Token;
}


const User = mongoose.model("User", userSchema);

module.exports = User;