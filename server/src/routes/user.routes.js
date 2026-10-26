// src/routes/user.routes.js

const express = require("express")
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/user/user.controller");
const { protectUser } = require("../middleware/auth.middleware");


router.get("/profile", protectUser, getProfile);
router.put("/profile", protectUser, updateProfile);

module.exports = router;
