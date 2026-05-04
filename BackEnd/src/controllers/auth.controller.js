const { jwt } = require("../config/env.config");
const User = require("../models/user.model");
const sendEmail = require("../services/email.service");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccesToken,
  verifyRefreshToken,
} = require("../services/token.service");

/*register user if user created send a notication to verify email */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email: email });

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
      to: email,
      subject: "verify email",
      html: `
                <h2>Hello ${newUser.name}!</h2>
                <p>Thanks for registering. Please verify your email by clicking the link below:</p>
                <a href="${emailVerifyLink}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
                    Verify Email
                </a>
                <p>This link expires in 24 hours.</p>
                <p>If you didn't register, ignore this email.</p>`,
    });

    return res.status(201).json({
      message:
        "user registered successfully please check your email to verify!",
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

/*resend verify email*/
const resendVerifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      email,
      isVerified: false,
    });
    if (!user) {
      return res.status(500).json({
        message: "no unverified account with this email",
      });
    }

    if (
      user.emailVerificationToken &&
      user.emailVerificationTokenExpiresIn > Date.now()
    ) {
      return res.status(400).json({
        message: "please check your inbox , link expires in 30 minutes",
      });
    }

    const Token = await user.generateEmailVerificationToken();
    const emailVerifyLink = `http://localhost:3000/api/auth/verify-email/${Token}`;

    await sendEmail({
      to: email,
      subject: "verify email",
      html: `
                <h2>Hello ${user.name}!</h2>
                <p>Thanks for registering. Please verify your email by clicking the link below:</p>
                <a href="${emailVerifyLink}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
                    Verify Email
                </a>
                <p>This link expires in 30 minutes.</p>
                <p>If you didn't register, ignore this email.</p>`,
    });

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

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpiresIn: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    ((user.isVerified = true),
      (user.emailVerificationToken = undefined),
      (user.emailVerificationTokenExpiresIn = undefined),
      await user.save());
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
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        message: "user not found , please register a user before login",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "email is not verified plese verify email",
      });
    }

    const matchPassword = await user.comparePassword(password);
    if (!matchPassword) {
      return res.status(400).json({
        messgae: "invalid email or password",
      });
    }
    const payload = { id: user._id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

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
      user: {
        name: user.name,
        email: user.email,
      },
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
  if (!token)
    return res.status(401).json({
      message: "unauthorized, not found refreshToken",
    });

   const decode = await verifyRefreshToken(token); 
  if (!decode || !decode.email) {
        return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
  
  const user = await User.findOne({email:decode.email})
  if (!user)
    return res.status(401).json({
      message: "invalid refesh token",
    });

  const payload = {
    id: user._id,
    email: user.email,
  };
  const newAccesToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  user.refreshToken = newRefreshToken;
  await user.save();

  res.cookie("accessToken", newAccesToken, {
    httpOnly: true,
  });
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
  });
  res.status(200).json({
    messGE:'TOKEN RENEWED'
  })
};

const logout = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, invalid token" });
  }

  const decode = verifyAccesToken(token);
  if (!decode) {
    return res.status(401).json({
      message: "invalid or expired token",
    });
  }

  const user = await User.findById(decode.id);
  user.refreshToken = undefined;
  await user.save();

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
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, invalid token" });
  }

  const decode = verifyAccesToken(token);
  if (!decode) {
    return res.status(401).json({
      message: "invalid or expired token",
    });
  }

  const user = await User.findById(decode.id).select(
    "-password -refreshToken -__v",
  );
  if (!user)
    return res.status(404).json({
      message: "please login ",
    });

  res.status(200).json({
    success: true,
    user,
  });
};

module.exports = {
  registerUser,
  verifyEmail,
  resendVerifyEmail,
  loginUser,
  logout,
  currentUser,
  renewAcessToken,
};
