const WorkoutPlan = require("../../models/workoutPlanModel");

// @desc    Add new workout plan
// @route   POST /api/admin/workout-plans
// @access  Private/Admin
const createWorkoutPlan = async (req, res) => {
  try {
    const { title, goal, level, exercises, isActive } = req.body;

    // Simple validations
    if (!title || !goal || !level) {
      return res.status(400).json({
        success: false,
        message: "Title, goal, and level are required",
      });
    }

    const existingPlan = await WorkoutPlan.findOne({ title });
    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message: "A workout plan with this title already exists",
      });
    }

    const newPlan = await WorkoutPlan.create({
      title,
      goal,
      level,
      exercises: exercises || [],
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Workout plan created successfully",
      data: newPlan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all workout plans (supports filtering by goal, level)
// @route   GET /api/admin/workout-plans
// @access  Private/Admin
const getAllWorkoutPlans = async (req, res) => {
  try {
    const { goal, level } = req.query;
    const filter = {};

    if (goal) {
      filter.goal = goal;
    }
    if (level) {
      filter.level = level;
    }

    const plans = await WorkoutPlan.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get a single workout plan by ID
// @route   GET /api/admin/workout-plans/:id
// @access  Private/Admin
const getWorkoutPlanById = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update workout plan
// @route   PUT /api/admin/workout-plans/:id
// @access  Private/Admin
const updateWorkoutPlan = async (req, res) => {
  try {
    const { title, goal, level, exercises, isActive } = req.body;

    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    // Title validation for unique constraint
    if (title && title !== plan.title) {
      const existingPlan = await WorkoutPlan.findOne({ title });
      if (existingPlan) {
        return res.status(400).json({
          success: false,
          message: "Another workout plan with this title already exists",
        });
      }
    }

    const updatedPlan = await WorkoutPlan.findByIdAndUpdate(
      req.params.id,
      {
        title,
        goal,
        level,
        exercises,
        isActive,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Workout plan updated successfully",
      data: updatedPlan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete workout plan
// @route   DELETE /api/admin/workout-plans/:id
// @access  Private/Admin
const deleteWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Workout plan deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle workout plan active/inactive status
// @route   PATCH /api/admin/workout-plans/:id/status
// @access  Private/Admin
const toggleWorkoutPlanStatus = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    plan.isActive = !plan.isActive;
    await plan.save();

    return res.status(200).json({
      success: true,
      message: `Workout plan ${plan.isActive ? "activated" : "deactivated"} successfully`,
      data: plan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createWorkoutPlan,
  getAllWorkoutPlans,
  getWorkoutPlanById,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  toggleWorkoutPlanStatus,
};
