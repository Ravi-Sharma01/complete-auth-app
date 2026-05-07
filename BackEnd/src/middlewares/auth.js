const TokenService = require("../services/token.service");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token)
      return res.status(400).json({
        message: "invalid token",
      });

    const decode = await TokenService.verifyAccessToken(token);
    if (!decode)
      return res.status(400).json({
        message: "inavlid or expired token",
      });

    req.user = decode;
    console.log(req.user);
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = isAuthenticated;
