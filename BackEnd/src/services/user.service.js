const User = require("../models/user.model");
const EmailService = require("./email.service");
const TokenService = require("./token.service");

class UserService {
  //register a user

  static async #getUserByEmail({ email }) {
    const user = User.findOne({ email });
    if (!user) return null;
    return user;
  }

  static async register({ name, email, password , role}) {
    const user = await this.#getUserByEmail({ email });

    if (user) {
      const error = new Error("email is already exist");
      error.statusCode = 409;
      throw error;
    }

    const newUser = new User({ name, email, password , role});
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
      
      await EmailService.resendVerificationEmail({email});
      throw new Error("NOT_VERIFIED");
      // return 

    }

    const matchPassword = await user.comparePassword(password);
    if (!matchPassword) throw new Error("invalid email or wrong password");

    const payload = { id: user._id, email: user.email , role:user.role};
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
}

module.exports = UserService;
