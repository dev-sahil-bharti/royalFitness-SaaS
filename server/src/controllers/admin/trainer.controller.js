// src/controllers/admin/trainer.controller.js
const Trainer = require("../../models/trainerModel");

// @desc    Add new trainer
// @route   POST /api/admin/trainers
// @access  Private/Admin
const createTrainer = async (req, res) => {
  try {
    const { name, email, phone, experience, specialization, bio, availableSlots, image, socialLinks, status } = req.body;

    const existingTrainer = await Trainer.findOne({ email });
    if (existingTrainer) {
      return res.status(400).json({
        success: false,
        message: "Trainer with this email already exists",
      });
    }

    const newTrainer = await Trainer.create({
      name,
      email,
      phone,
      experience,
      specialization: specialization || [],
      bio: bio || "",
      availableSlots: availableSlots || [],
      image: image || "",
      socialLinks: socialLinks || {},
      status: status || "active",
    });

    return res.status(201).json({
      success: true,
      message: "Trainer created successfully",
      data: newTrainer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    View all trainers
// @route   GET /api/admin/trainers
// @access  Private/Admin
const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Trainers fetched successfully",
      data: trainers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    View a single trainer by ID
// @route   GET /api/admin/trainers/:id
// @access  Private/Admin
const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trainer fetched successfully",
      data: trainer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update trainer
// @route   PUT /api/admin/trainers/:id
// @access  Private/Admin
const updateTrainer = async (req, res) => {
  try {
    const { name, email, phone, experience, specialization, bio, availableSlots, image, socialLinks, status } = req.body;

    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    // Check if another trainer exists with the updated email
    if (email && email !== trainer.email) {
      const existingTrainer = await Trainer.findOne({ email });
      if (existingTrainer) {
        return res.status(400).json({
          success: false,
          message: "Another trainer with this email already exists",
        });
      }
    }

    const updatedTrainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        experience,
        specialization,
        bio,
        availableSlots,
        image,
        socialLinks,
        status,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Trainer updated successfully",
      data: updatedTrainer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete trainer
// @route   DELETE /api/admin/trainers/:id
// @access  Private/Admin
const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trainer deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update trainer status
// @route   PATCH /api/admin/trainers/:id/status
// @access  Private/Admin
const updateTrainerStatus = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    // If status is passed in body, use it, otherwise toggle between active/inactive
    if (req.body.status) {
      if (!["active", "inactive"].includes(req.body.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be 'active' or 'inactive'",
        });
      }
      trainer.status = req.body.status;
    } else {
      trainer.status = trainer.status === "active" ? "inactive" : "active";
    }

    await trainer.save();

    return res.status(200).json({
      success: true,
      message: `Trainer status updated to ${trainer.status} successfully`,
      data: trainer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
  updateTrainerStatus,
};
