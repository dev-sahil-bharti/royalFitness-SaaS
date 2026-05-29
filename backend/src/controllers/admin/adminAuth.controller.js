// src/controllers/adminAuth.controller.js
const Admin = require("../../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (adminId) => {
    return jwt.sign({ id: adminId, role: 'admin' }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

// POST /api/auth/admin/register
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, phone, age, gender, confirmPassword } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: "Admin email already in use" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
            phone,
            age,
            gender,
            confirmPassword: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "Admin registration successful",
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                gender: admin.gender,
                age: admin.age,
                phone: admin.phone,
                token: generateToken(admin._id),
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/auth/admin/login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                gender: admin.gender,
                token: generateToken(admin._id),
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// PUT  /api/admin/changePassword
const adminChangePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword, confirmPassword } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(oldPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        admin.password = hashedPassword;
        await admin.save();
        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                gender: admin.gender,
                token: generateToken(admin._id),
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { registerAdmin, loginAdmin, adminChangePassword };
