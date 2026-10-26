// src/routes/admin.routes.js
const express = require("express");
const router = express.Router();
const { getAdminProfile, updateAdminProfile, getDashboardStats } = require("../controllers/admin/admin.controller");
const {
    getUsers,
    getUserDetails,
    updateUser,
    deleteUser,
    toggleBlockUser,
    activateMembership,
    deactivateMembership,
    createUser
} = require("../controllers/admin/manageUsers.controller");
const { protectAdmin } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate");
const { trainerSchema } = require("../schemas/trainer.schema");
const {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlan,
    deletePlan,
    togglePlanStatus,
    togglePopularStatus,
    applyDiscount
} = require("../controllers/admin/plan.controller");
const {
    createTrainer,
    getAllTrainers,
    getTrainerById,
    updateTrainer,
    deleteTrainer,
    updateTrainerStatus
} = require("../controllers/admin/trainer.controller");
const {
    getAllBookings,
    getBookingDetails,
    approveBooking,
    rejectBooking,
    completeBooking,
    cancelBooking
} = require("../controllers/admin/booking.controller");
const upload = require("../middleware/upload");
const {
    uploadImage,
    getAllImages,
    deleteImage,
    toggleImageStatus
} = require("../controllers/admin/manageGallery");
const {
    createWorkoutPlan,
    getAllWorkoutPlans,
    getWorkoutPlanById,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    toggleWorkoutPlanStatus
} = require("../controllers/admin/workoutPlane.controller");

// admin routes
router.get("/profile", protectAdmin, getAdminProfile);
router.put("/profile", protectAdmin, updateAdminProfile);
router.get("/dashboard-stats", protectAdmin, getDashboardStats);

// Manage Users
router.get("/users", protectAdmin, getUsers);
router.post("/users", protectAdmin, createUser);
router.get("/users/:id", protectAdmin, getUserDetails);
router.put("/users/:id", protectAdmin, updateUser);
router.delete("/users/:id", protectAdmin, deleteUser);
router.put("/users/:id/block", protectAdmin, toggleBlockUser);
router.put("/users/:id/membership/activate", protectAdmin, activateMembership);
router.put("/users/:id/membership/deactivate", protectAdmin, deactivateMembership);

// Manage Plans
router.get("/plans", protectAdmin, getAllPlans);
router.post("/plans", protectAdmin, createPlan);
router.get("/plans/:id", protectAdmin, getPlanById);
router.put("/plans/:id", protectAdmin, updatePlan);
router.delete("/plans/:id", protectAdmin, deletePlan);
router.patch("/plans/:id/status", protectAdmin, togglePlanStatus);
router.patch("/plans/:id/popular", protectAdmin, togglePopularStatus);
router.patch("/plans/:id/discount", protectAdmin, applyDiscount);

// Manage Trainers
router.get("/trainers", protectAdmin, getAllTrainers);
router.post("/trainers", protectAdmin, validate(trainerSchema), createTrainer);
router.get("/trainers/:id", protectAdmin, getTrainerById);
router.put("/trainers/:id", protectAdmin, validate(trainerSchema), updateTrainer);
router.delete("/trainers/:id", protectAdmin, deleteTrainer);
router.patch("/trainers/:id/status", protectAdmin, updateTrainerStatus);

// Manage Bookings
router.get("/bookings", protectAdmin, getAllBookings);
router.get("/bookings/:id", protectAdmin, getBookingDetails);
router.patch("/bookings/:id/approve", protectAdmin, approveBooking);
router.patch("/bookings/:id/reject", protectAdmin, rejectBooking);
router.patch("/bookings/:id/complete", protectAdmin, completeBooking);
router.patch("/bookings/:id/cancel", protectAdmin, cancelBooking);

// Manage Gallery
router.post("/gallery", protectAdmin, upload.single("image"), uploadImage);
router.get("/gallery", protectAdmin, getAllImages);
router.delete("/gallery/:id", protectAdmin, deleteImage);
router.patch("/gallery/:id/status", protectAdmin, toggleImageStatus);

// Manage Workout Plans
router.get("/workout-plans", protectAdmin, getAllWorkoutPlans);
router.post("/workout-plans", protectAdmin, createWorkoutPlan);
router.get("/workout-plans/:id", protectAdmin, getWorkoutPlanById);
router.put("/workout-plans/:id", protectAdmin, updateWorkoutPlan);
router.delete("/workout-plans/:id", protectAdmin, deleteWorkoutPlan);
router.patch("/workout-plans/:id/status", protectAdmin, toggleWorkoutPlanStatus);

module.exports = router;
