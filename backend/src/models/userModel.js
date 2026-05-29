// src/models/userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    confirmPassword: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    fitnessGoal: {
      type: String,
      enum: ["weight_loss", "muscle_gain", "general_fitness", "strength", "cardio"],
      default: "general_fitness",
    },

    membershipPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null,
    },

    membershipStartDate: {
      type: Date,
      default: null,
    },

    membershipEndDate: {
      type: Date,
      default: null,
    },

    membershipStatus: {
      type: String,
      enum: ["active", "expired", "pending", "none"],
      default: "none",
    },

    profileImage: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);