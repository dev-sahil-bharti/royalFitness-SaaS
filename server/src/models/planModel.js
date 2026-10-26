//src/models/ planModel.js
const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    durationType: {
      type: String,
      enum: ["days", "months", "years"],
      default: "months",
    },

    features: [
      {
        type: String,
      },
    ],

    description: {
      type: String,
    },

    discount: {
      type: Number,
      default: 0,
    },

    isPopular: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("Plan", planSchema);