// src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser, googleLoginUser, userChangePassword } = require("../controllers/user/userAuth.controller");
const { registerAdmin, loginAdmin, adminChangePassword } = require("../controllers/admin/adminAuth.controller");
const { protectUser, protectAdmin } = require("../middleware/auth.middleware");

// User Auth Routes
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.post("/user/google", googleLoginUser);
router.put("/user/changePassword", protectUser, userChangePassword);

// Admin Auth Routes
router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);
router.put("/admin/changePassword", protectAdmin, adminChangePassword);

module.exports = router;