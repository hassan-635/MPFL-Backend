const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const protect = async (req, res, next) => {
  let token;

  // Check for token in cookies or Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  console.log("Auth Middleware - Token:", token ? "Present" : "Missing");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.id).select("-password");
      console.log(
        "Auth Middleware - Verified User:",
        req.user ? req.user._id : "User Not Found"
      );
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }
      next();
    } catch (err) {
      console.error("Auth Middleware Error:", err.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
