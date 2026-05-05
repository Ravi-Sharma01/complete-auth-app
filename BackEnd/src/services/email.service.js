const nodemailer = require("nodemailer");
const { email } = require("../config/env.config");
const User = require("../models/user.model");

class EmailService {
  static async #sendEmail({ to, subject, html }) {
    const transpoter = nodemailer.createTransport({
      host: email.host,
      port: email.port,
      auth: {
        user: email.user,
        pass: email.pass
      }
    });
    const mailOptions = {
      from: `email verify app ${email.email_from}`,
      to,
      subject,
      html
    }

    await transpoter.sendMail(mailOptions);
  }

  static async verifyUserEmail({token}){
    const user = await User.findOne({
      emailVerificationToken : token,
      emailVerificationTokenExpiresIn : {$gt:Date.now()}
    });

    if(!user) throw new Error('invalid or expired token');

    user.isVerified = true;
    user.emailVerificationTokenExpiresIn = undefined;
    user.emailVerificationToken =undefined;
    await user.save();

  }
  
  static async sendVerificationEmail({ name, email, token }) {
    const emailVerifyLink = `http://localhost:3000/api/auth/verify-email/${token}`;
    await this.#sendEmail({
      to: email,
      subject: "verify email",
      html: `
                        <h2>Hello ${name}!</h2>
                        <p>Thanks for registering. Please verify your email by clicking the link below:</p>
                        <a href="${emailVerifyLink}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
                            Verify Email
                        </a>
                        <p>This link expires in 24 hours.</p>
                        <p>If you didn't register, ignore this email.</p>`,
    });
  }

  static async resendVerificationEmail({email}){
    const user = await User.findOne({
      email,
      isVerified : false
    });

    if(!user){
      const error = new Error('email is verifed you can login');
      error.statusCode = 500;
      throw error;
    }

    if(user.emailVerificationToken && user.emailVerificationTokenExpiresIn > Date.now()){
      throw new Error('please check your inbox , link expires in 30 minutes!')
    }
    const name = user.name;
    const token = await user.generateEmailVerificationToken();
    await this.sendVerificationEmail({name, email, token});
   
  }

  
}

module.exports = EmailService;
