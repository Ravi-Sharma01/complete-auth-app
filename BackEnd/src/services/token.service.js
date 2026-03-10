const jwt = require("jsonwebtoken");
const { jwt: jwtConfig } = require("../config/env.config");

//generate accces token
const generateAccessToken = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

//generate refreshtoken
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpires,
  });
};

//verify acccess token
const verifyAccesToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.log("Access token expired");
    }
    console.log("invalid access token");
    return null;
  }
};


//verify refresh token
const verifyRefreshToken = (token)=>{
    try {
        return jwt.verify(token, jwtConfig.refreshSecret);

    } catch (error) {
        if(error.name === 'TokenExpiredIn'){
            console.log("refreshToken expired please login again.");
        }
        console.log('invalid refresh token')
        return null
    }
}
module.exports ={
    generateAccessToken,
    generateRefreshToken,
    verifyAccesToken,
    verifyRefreshToken,
}