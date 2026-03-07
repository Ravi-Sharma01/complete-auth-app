const User = require("../models/user.model");
const sendEmail = require("../services/email.service");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user =await User.findOne({ email: email });

    if (user) {
      return res.status(409).json({ message: "email is already exist" });
    }

    const newUser = new User({
        name,
        email,
        password,
    });
   
    const Token = await newUser.generateEmailVerificationToken();
    const emailVerifyLink = `http://localhost:3000/api/auth/verify-email/${Token}`;
    await sendEmail({
        to:email,
        subject:'verify email',
        html: `
                <h2>Hello ${name}!</h2>
                <p>Thanks for registering. Please verify your email by clicking the link below:</p>
                <a href="${emailVerifyLink}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
                    Verify Email
                </a>
                <p>This link expires in 24 hours.</p>
                <p>If you didn't register, ignore this email.</p>`,
    });

    return res.status(201).json({
      message: "user registered successfully please check your email to verify!",
      user: {
        name,
        email,
      },
    });
  } catch (err) {
     res.status(500).json({
      message: "server error",
      error: err.message,
    });
  }
};


const verifyEmail = async(req, res)=>{
    try{
    const {token} = req.params

    const user =await User.findOne({
        emailVerificationToken:token,
        emailVerificationTokenExpiresIn:{ $gt: Date.now()},
    })
    
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    user.isverified = true,
    user.emailVerificationToken = undefined,
    user.emailVerificationTokenExpiresIn = undefined,
    await user.save();
     res.status(200).json({ message: "email verified ! you can log in now" });
}catch(err){
   res.status(500).json({
      message: "server error",
      error: err.message,
    });
}

}
module.exports = { registerUser, verifyEmail };
