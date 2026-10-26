// src/controllers/admin/plan.controller.js
const Plan = require("../../models/planModel");

// @desc    Add new plan
// @route   POST /api/admin/plans
// @access  Private/Admin
const createPlan = async (req, res) => {
  try {
    const { name, price, duration, durationType, features, description, discount, isPopular, isActive } = req.body;

    // Basic validations
    if (!name || !price || !duration) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and duration are required",
      });
    }

    const existingPlan = await Plan.findOne({ name });
    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message: "Plan with this name already exists",
      });
    }

    const newPlan = await Plan.create({
      name,
      price,
      duration,
      durationType: durationType || "months",
      features: features || [],
      description,
      discount: discount || 0,
      isPopular: isPopular || false,
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: newPlan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    View all plans
// @route   GET /api/admin/plans
// @access  Private/Admin
const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Plans fetched successfully",
      data: plans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    View a single plan by ID
// @route   GET /api/admin/plans/:id
// @access  Private/Admin
const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Plan fetched successfully",
      data: plan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update plan
// @route   PUT /api/admin/plans/:id
// @access  Private/Admin
const updatePlan = async (req, res) => {
  try {
    const { name, price, duration, durationType, features, description, discount, isPopular, isActive } = req.body;

    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    // Check if another plan exists with the updated name
    if (name && name !== plan.name) {
      const existingPlan = await Plan.findOne({ name });
      if (existingPlan) {
        return res.status(400).json({
          success: false,
          message: "Another plan with this name already exists",
        });
      }
    }

    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        duration,
        durationType,
        features,
        description,
        discount,
        isPopular,
        isActive,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      data: updatedPlan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete plan
// @route   DELETE /api/admin/plans/:id
// @access  Private/Admin
const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Plan deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Activate/deactivate plan
// @route   PATCH /api/admin/plans/:id/status
// @access  Private/Admin
const togglePlanStatus = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    plan.isActive = !plan.isActive;
    await plan.save();

    return res.status(200).json({
      success: true,
      message: `Plan ${plan.isActive ? "activated" : "deactivated"} successfully`,
      data: plan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Mark plan as popular
// @route   PATCH /api/admin/plans/:id/popular
// @access  Private/Admin
const togglePopularStatus = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    plan.isPopular = !plan.isPopular;
    await plan.save();

    return res.status(200).json({
      success: true,
      message: `Plan marked as ${plan.isPopular ? "popular" : "not popular"} successfully`,
      data: plan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add discount
// @route   PATCH /api/admin/plans/:id/discount
// @access  Private/Admin
const applyDiscount = async (req, res) => {
  try {
    const { discount } = req.body;

    if (discount === undefined || isNaN(discount) || discount < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid discount percentage is required",
      });
    }

    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    plan.discount = discount;
    await plan.save();

    return res.status(200).json({
      success: true,
      message: "Discount applied successfully",
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
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  togglePlanStatus,
  togglePopularStatus,
  applyDiscount,
};
