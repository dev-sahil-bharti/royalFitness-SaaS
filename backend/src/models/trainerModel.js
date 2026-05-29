// src/models/trainerModel.js
const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema(
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
    phone: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    specialization: [
      {
        type: String,
      },
    ],
    bio: {
      type: String,
    },
    availableSlots: [
      {
        type: String, // E.g., "Morning", "Evening", or "09:00 AM - 12:00 PM"
      },
    ],
    image: {
      type: String,
      default: "",
    },
    socialLinks: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trainer", trainerSchema);
