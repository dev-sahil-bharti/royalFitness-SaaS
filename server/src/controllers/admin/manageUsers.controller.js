// src/controllers/admin/manageUsers.controller.js
const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");

// GET /api/admin/users
// Supports query: ?search=john&status=active
const getUsers = async (req, res) => {
    try {
        const { search, status } = req.query;
        let query = {};

        // 1. Search user by name/email/phone
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }

        // 2. Filter by active/expired membership
        if (status) {
            query.membershipStatus = status; // "active", "expired", "pending", "none"
        }

        const users = await User.find(query).select("-password -confirmPassword").sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            count: users.length,
            data: users,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/admin/users/:id
const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password -confirmPassword").populate("membershipPlan");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/admin/users/:id
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Prevent password update via this route
        if (updates.password || updates.confirmPassword) {
            delete updates.password;
            delete updates.confirmPassword;
        }

        const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select("-password -confirmPassword");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/admin/users/:id/block
const toggleBlockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.isActive = !user.isActive;
        await user.save();

        const action = user.isActive ? "unblocked" : "blocked";

        return res.status(200).json({
            success: true,
            message: `User ${action} successfully`,
            data: {
                _id: user._id,
                isActive: user.isActive
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/admin/users/:id/membership/activate
const activateMembership = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.membershipStatus = "active";

        // Optionally set start date to now if not set
        if (!user.membershipStartDate) {
            user.membershipStartDate = new Date();
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User membership activated successfully",
            data: {
                _id: user._id,
                membershipStatus: user.membershipStatus,
                membershipStartDate: user.membershipStartDate
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/admin/users/:id/membership/deactivate
const deactivateMembership = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.membershipStatus = "expired";
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User membership deactivated successfully",
            data: {
                _id: user._id,
                membershipStatus: user.membershipStatus
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/admin/users
const createUser = async (req, res) => {
    try {
        const { name, email, password, phone, age, gender } = req.body;

        if (!name || !email || !password || !phone || !age) {
            return res.status(400).json({ success: false, message: "Please populate all mandatory fields." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "This email address is already mapped to another member." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            age,
            gender: gender || "Male",
            confirmPassword: hashedPassword,
        });

        const userPayload = newUser.toObject();
        delete userPayload.password;
        delete userPayload.confirmPassword;

        return res.status(201).json({
            success: true,
            message: "User registry added successfully!",
            data: userPayload,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getUsers,
    getUserDetails,
    updateUser,
    deleteUser,
    toggleBlockUser,
    activateMembership,
    deactivateMembership,
    createUser
};
