// src/middleware/auth.middleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");

const protectUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found or unauthorized" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized, invalid token" });
  }
};

const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // We can also check if decoded.role === 'admin' if we added it during token generation
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Forbidden, not an admin token" });
    }

    req.admin = await Admin.findById(decoded.id).select("-password");
    if (!req.admin) {
      return res.status(401).json({ success: false, message: "Admin not found or unauthorized" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized, invalid token" });
  }
};

module.exports = { protectUser, protectAdmin };