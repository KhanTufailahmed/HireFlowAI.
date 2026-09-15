import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    resumeUrl: {
      type: String,
      required: true,
    },

    resumeData: {
      skills: {
        type: [String],
        default: [],
      },

      education: {
        type: [String],
        default: [],
      },

      experience: {
        type: [String],
        default: [],
      },

      projects: {
        type: [String],
        default: [],
      },

      totalExperience: {
        type: Number,
        default: 0,
      },
    },

    screening: {
      matchedSkills: {
        type: [String],
        default: [],
      },

      missingSkills: {
        type: [String],
        default: [],
      },

      score: {
        type: Number,
        default: 0,
      },

      summary: {
        type: String,
        default: "",
      },

      recommendation: {
        type: String,
        enum: ["pending", "qualified", "rejected"],
        default: "pending",
      },
    },

    status: {
      type: String,
      enum: [
        "applied",
        "admin_review",
        "assessment_sent",
        "assessment_completed",
        "finalist",
        "interview_scheduled",
        "rejected",
      ],
      default: "applied",
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;