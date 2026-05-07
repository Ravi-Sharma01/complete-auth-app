const jwt = require("jsonwebtoken");
const { jwt: jwtConfig } = require("../config/env.config");
const User = require("../models/user.model");

class TokenService {
  // Generate Access Token
  static generateAccessToken(payload) {
    return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
  }

  // Generate Refresh Token
  static generateRefreshToken(payload) {
    return jwt.sign(payload, jwtConfig.refreshSecret, {
      expiresIn: jwtConfig.refreshExpires,
    });
  }

  // Verify Access Token
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, jwtConfig.secret);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        console.error("Access token expired");
      } else {
        console.error("Invalid access token");
      }
      return null;
    }
  }

  // Verify Refresh Token
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, jwtConfig.refreshSecret);
    } catch (err) {
      // Fixed the error name to 'TokenExpiredError'
      if (err.name === "TokenExpiredError") {
        console.error("Refresh token expired, please login again.");
      } else {
        console.error("Invalid refresh token");
      }
      return null;
    }
  }

  static async renewToken(token) {
    if (!token) throw new Error("unauthorized, not found refreshToken");

    const decode = await this.verifyRefreshToken(token);
    if (!decode) throw new Error("Invalid or expired refresh token");

    const user = await User.findById({ _id: decode.id });
    if (!user) throw new Error("invalid refesh token");

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    const newAccesToken = await this.generateAccessToken(payload);
    const newRefreshToken = await this.generateRefreshToken(payload);

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
      newAccesToken,
      newRefreshToken
    }
  }
}

module.exports = TokenService;
