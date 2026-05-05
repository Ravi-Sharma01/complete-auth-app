const { jwt } = require("../config/env.config");
const User = require("../models/user.model");
const sendEmail = require("../services/email.service");
const UserService = require("../services/user.service");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccesToken,
  verifyRefreshToken,
} = require("../services/token.service");
const EmailService = require("../services/email.service");
const userService = require("../services/user.service");
const TokenService = require("../services/token.service");

/*register user if user created send a notication to verify email */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserService.register({ name, email, password });

    return res.status(201).json({
      message:
        "user registered successfully please check your email to verify!",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "server error",
      error: err.message,
    });
  }
};

/*resend verify email*/
const resendEmail = async (req, res) => {
  try {
    const { email } = req.body;

    await EmailService.resendVerificationEmail({email});
    
    res.status(200).json({
      success: true,
      messgae: "new verification email is sent ! please check your inbox.",
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};
/**when user clicks verify email then verify email */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    await EmailService.verifyUserEmail({token});

    res.status(200).json({ message: "email verified ! you can log in now" });
  } catch (err) {
    res.status(500).json({
      message: "server error",
      error: err.message,
    });
  }
};

/* login user when email is verified  and create jwt tokens */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
   

   const {accessToken, refreshToken, user} = await UserService.login({email, password});
    
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // in pruduction https value true
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: false, // in pruduction https value true
    });
    res.status(200).json({
      message: "login successfully.",
      user
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};

const renewAcessToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  const {newAccesToken, newRefreshToken} = await TokenService.renewToken(token);
  res.cookie("accessToken", newAccesToken, {
    httpOnly: true,
  });
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
  });
  res.status(200).json({
    messGE: "TOKEN RENEWED",
  });
};

const logoutUser = async (req, res) => {
  const token = req.cookies.accessToken;
  
  await UserService.logout({token});
  res.clearCookie("accessToken", {
    httpOnly: true,
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
  });

  res.status(200).json({
    message: "logged out successfully",
  });
};

const currentUser = async (req, res) => {
  const token = req.cookies.accessToken;
  const user = await UserService.userProfile({token});

  res.status(200).json({
    success: true,
    user,
  });
};

module.exports = {
  registerUser,
  verifyEmail,
  resendEmail,
  loginUser,
  logoutUser,
  currentUser,
  renewAcessToken,
};
