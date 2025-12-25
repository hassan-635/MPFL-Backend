const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const protect = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("Auth Middleware - Token:", token ? "Present" : "Missing"); // Log token presence
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.id).select("-password");
      console.log(
        "Auth Middleware - Verified User:",
        req.user ? req.user._id : "User Not Found"
      );
      next();
    } catch (err) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
