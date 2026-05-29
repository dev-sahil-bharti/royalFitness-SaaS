// src/controllers/admin.controller.js
const Admin = require("../../models/adminModel");
const User = require("../../models/userModel");
const Booking = require("../../models/bookingModel");
const Trainer = require("../../models/trainerModel");

// GET /api/admin/profile
const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select("-password -confirmPassword");
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Admin profile fetched successfully",
            data: admin,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/admin/profile
const updateAdminProfile = async (req, res) => {
    try {
        const { name, phone, age, gender } = req.body;

        const updatedAdmin = await Admin.findByIdAndUpdate(
            req.admin.id,
            { name, phone, age, gender },
            { new: true, runValidators: true }
        ).select("-password -confirmPassword");

        if (!updatedAdmin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Admin profile updated successfully",
            data: updatedAdmin,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/admin/dashboard-stats
const getDashboardStats = async (req, res) => {
    try {
        // 1. Metric Counts
        const totalMembers = await User.countDocuments();
        const activeMembers = await User.countDocuments({ membershipStatus: "active" });
        const totalBookings = await Booking.countDocuments();
        const pendingBookings = await Booking.countDocuments({ status: "Pending" });

        // Revenue Sum for status "Approved" or "Completed"
        const revenueResult = await Booking.aggregate([
            { $match: { status: { $in: ["Approved", "Completed"] } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // 2. Recent Bookings (limit 5)
        const recentBookings = await Booking.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name profileImage")
            .populate("plan", "name")
            .populate("trainer", "name");

        // 3. Top Trainers: Fetch active trainers and compute clients
        const activeTrainers = await Trainer.find({ status: "active" }).limit(5);
        const topTrainers = [];
        for (const tr of activeTrainers) {
            const clientCount = await Booking.countDocuments({ trainer: tr._id, status: { $in: ["Approved", "Completed"] } });
            topTrainers.push({
                _id: tr._id,
                name: tr.name,
                experience: tr.experience,
                specialization: tr.specialization,
                image: tr.image,
                clients: clientCount || 0,
                rating: 4.8
            });
        }
        topTrainers.sort((a, b) => b.clients - a.clients);

        return res.status(200).json({
            success: true,
            message: "Dashboard statistics retrieved successfully",
            data: {
                metrics: {
                    totalMembers,
                    activeMembers,
                    totalBookings,
                    pendingBookings,
                    totalRevenue
                },
                recentBookings,
                topTrainers
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAdminProfile, updateAdminProfile, getDashboardStats };
