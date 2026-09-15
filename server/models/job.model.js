import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    requiredSkills: {
      type: [String],
      required: true,
    },

    minimumExperience: {
      type: Number,
      default: 0,
    },

    screeningThreshold: {
      type: Number,
      default: 70,
    },

    assessmentPassingScore: {
      type: Number,
      default: 60,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;