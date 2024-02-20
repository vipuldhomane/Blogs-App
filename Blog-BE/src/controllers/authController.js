const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// SignUp
// Cookies not set yet
exports.signup = async (req, res) => {
  const { name, email, password, username } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.findOne({ email });
  if (!user) {
    const user = new User({ name, email, password: hashedPassword, username });
    await user.save();
    res.status(201).send("User created successfully");
  } else {
    res.status(401).send("User Email already registered");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send("User not found");
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Save token to user document in database
    user.token = token;
    user.password = undefined;
    // Set cookie for token and return success response
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: "User Login Success",
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Password is incorrect",
    });
  }
};
// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) {
//     return res.status(404).send("User not found");
//   }
//   if (password) {
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).send("Invalid password");
//     }
//     const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
//     res.json({ token });
//   } else {
//     return res.status(401).send("password not provided");
//   }
// };
