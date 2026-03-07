const User = require("../models/user.model");

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
    newUser.save();


    // const emailVerifyLink = `http://localhost:3000/api/auth/verify-email/${Token}`;

    return res.status(201).json({
      message: "user registered successfully",
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
module.exports = { registerUser };
