const User = require("../models/user.model");
const EmailService = require("./email.service");
const TokenService = require("./token.service");

class UserService {
  //register a user

  static async #getUserByEmail({ email }) {
    return await User.findOne({ email });
  }

  static async register({ name, email, password, role }) {
    const user = await this.#getUserByEmail({ email });

    if (user) {
      const error = new Error("email is already exist");
      error.statusCode = 409;
      throw error;
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    const token = await newUser.generateEmailVerificationToken();
    await EmailService.sendVerificationEmail({ name, email, token });
    return { name, email };
  }

  static async login({ email, password }) {
    const user = await this.#getUserByEmail({ email });

    if (!user || user === null) {
      throw new Error("user not found , register");
    }

    if (!user.isVerified) {
      await EmailService.resendVerificationEmail({ email });
      throw new Error("NOT_VERIFIED");
      // return
    }

    const matchPassword = await user.comparePassword(password);
    if (!matchPassword) throw new Error("invalid email or wrong password");

    const payload = { id: user._id, email: user.email, role: user.role };
    const accessToken = TokenService.generateAccessToken(payload);
    const refreshToken = TokenService.generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    return {
      refreshToken,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }

  static async logout({ token }) {
    if (!token) throw new Error("unathorized, invalid token");

    const decode = await TokenService.verifyAccessToken(token);
    if (!decode) throw new Error("invalid or expired token");

    const user = await User.findById({ _id: decode.id });
    user.refreshToken = undefined;
    await user.save();
  }

  static async userProfile({ token }) {
    if (!token) {
      throw new Error("Unauthorized, invalid token");
    }

    const decode = await TokenService.verifyAccessToken(token);
    if (!decode) {
      throw new Error("invalid token, expired token");
    }

    const user = await User.findById(decode.id).select(
      "-password -refreshToken -__v",
    );
    if (!user) throw new Error("please login");

    return user;
  }

  static async forgetPassword({ email }) {
    if (!email) throw new Error("email is required");

    const user = await this.#getUserByEmail({ email });

    if (!user) throw new Error("user not found , please register!");

    const token = await  user.generatepasswordResetToken();
    const name = user.name;
    const response = await EmailService.sendPasswordResetEmail({name, email, token});
    
  }

  static async resetPassword({ token , password }) {
   if (!token) throw new Error("reset password token is required");
   if (!password) throw new Error("password is required");

   const user = await User.findOne({
      passwordToken: token,
      passwordTokenExpiresIn: { $gt: Date.now() } // $gt means "greater than"
    });
   
    if(!user) throw new Error('reset password link expired try again later')

   
    user.password = password;
    user.passwordToken = undefined;
    user.passwordTokenExpiresIn=undefined;
    await user.save(); 
  }
}

module.exports = UserService;
