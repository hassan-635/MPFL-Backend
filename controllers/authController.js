const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email: rawEmail, password } = req.body;
    const email = rawEmail.toLowerCase();
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already Exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(200).json({ message: "User Registered Successfully!!!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body;
    const email = rawEmail.toLowerCase();
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRY,
      });
      res.cookie("token", token, { maxAge: 30 * 24 * 60 * 60 * 1000 });
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid Email or Password!!!" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  if (!req.cookies.token) {
    return res.status(401).json({ message: "You are not logged in..." });
  }
  res.cookie("token", "", { maxAge: 1 });
  res.json({ message: "Logged out successfully!!!" });
};
