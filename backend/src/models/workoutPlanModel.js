const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  day: {
    type: String,
    required: [true, "Day is required (e.g. Monday, Day 1)"],
  },
  exerciseName: {
    type: String,
    required: [true, "Exercise name is required"],
    trim: true,
  },
  sets: {
    type: Number,
    required: [true, "Sets count is required"],
    min: [1, "Sets must be at least 1"],
  },
  reps: {
    type: String,
    required: [true, "Reps description is required"],
    trim: true,
  },
  restTime: {
    type: String,
    required: [true, "Rest time is required"],
    trim: true,
  },
  instructions: {
    type: String,
    trim: true,
  },
  videoUrl: {
    type: String,
    trim: true,
  },
});

const workoutPlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Workout plan title is required"],
      trim: true,
      unique: true,
    },
    goal: {
      type: String,
      required: [true, "Goal is required"],
      enum: {
        values: ["Weight Loss", "Muscle Gain", "General Fitness", "Strength", "Cardio"],
        message: "Invalid goal. Must be Weight Loss, Muscle Gain, General Fitness, Strength, or Cardio",
      },
    },
    level: {
      type: String,
      required: [true, "Difficulty level is required"],
      enum: {
        values: ["Beginner", "Intermediate", "Advanced"],
        message: "Invalid level. Must be Beginner, Intermediate, or Advanced",
      },
    },
    exercises: {
      type: [exerciseSchema],
      default: [],
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

module.exports = mongoose.model("WorkoutPlan", workoutPlanSchema);
