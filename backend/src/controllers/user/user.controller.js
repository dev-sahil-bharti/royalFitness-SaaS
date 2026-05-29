// src/controllers/user.controller.js
const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");

// GET /api/user/profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password -confirmPassword");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/user/profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone, age, gender, fitnessGoal, membershipPlan } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (age) user.age = age;
        if (gender) user.gender = gender;
        if (fitnessGoal) user.fitnessGoal = fitnessGoal;
        if (membershipPlan) user.membershipPlan = membershipPlan;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                age: user.age,
                gender: user.gender,
                fitnessGoal: user.fitnessGoal,
                membershipPlan: user.membershipPlan
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { getProfile, updateProfile };
