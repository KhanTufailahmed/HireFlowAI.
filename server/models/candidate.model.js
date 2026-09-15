import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
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
    },

    phone: {
      type: String,
      required: true,
    },

    resumeUrl: {
      type: String,
      default: "",
    },

    extractedData: {
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
      score: {
        type: Number,
        default: 0,
      },

      summary: {
        type: String,
        default: "",
      },

      strengths: {
        type: [String],
        default: [],
      },

      weaknesses: {
        type: [String],
        default: [],
      },

      recommendation: {
        type: String,
        enum: ["pending", "qualified", "rejected"],
        default: "pending",
      },
    },

    hiringStage: {
      type: String,
      enum: [
        "applied",
        "screening",
        "assessment_sent",
        "assessment_completed",
        "admin_review",
        "finalist",
        "interview_scheduled",
        "rejected",
      ],
      default: "applied",
    },
  },
  {
    timestamps: true,
  },
);

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;
