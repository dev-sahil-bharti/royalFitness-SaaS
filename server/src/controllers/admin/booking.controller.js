// src/controllers/admin/booking.controller.js
const Booking = require("../../models/bookingModel");

/**
 * @desc    Get all bookings (with optional date filter)
 * @route   GET /api/admin/bookings
 * @access  Private/Admin
 */
const getAllBookings = async (req, res) => {
  try {
    const { date, status, type } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (date) {
      // Assuming date is sent in YYYY-MM-DD format
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      filter.date = { $gte: startDate, $lte: endDate };
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (type) {
      filter.type = type;
    }

    const bookings = await Booking.find(filter)
      .populate("user", "name email phone profileImage")
      .populate("plan", "name price duration")
      .populate("trainer", "name experience specialization image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Error in getAllBookings:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Get booking details by ID
 * @route   GET /api/admin/bookings/:id
 * @access  Private/Admin
 */
const getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email phone profileImage age gender fitnessGoal")
      .populate("plan", "name price duration features description")
      .populate("trainer", "name email phone experience specialization bio image");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Error in getBookingDetails:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Approve a booking
 * @route   PATCH /api/admin/bookings/:id/approve
 * @access  Private/Admin
 */
const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking approved successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error in approveBooking:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Reject a booking
 * @route   PATCH /api/admin/bookings/:id/reject
 * @access  Private/Admin
 */
const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error in rejectBooking:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Complete a booking
 * @route   PATCH /api/admin/bookings/:id/complete
 * @access  Private/Admin
 */
const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "Completed" },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking marked as completed",
      data: booking,
    });
  } catch (error) {
    console.error("Error in completeBooking:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Cancel a booking
 * @route   PATCH /api/admin/bookings/:id/cancel
 * @access  Private/Admin
 */
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error in cancelBooking:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllBookings,
  getBookingDetails,
  approveBooking,
  rejectBooking,
  completeBooking,
  cancelBooking,
};
