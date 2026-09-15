import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      unique: true,
    },

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

    questions: [
      {
        question: {
          type: String,
          required: true,
        },

        expectedKeyPoints: {
          type: [String],
          default: [],
        },

        candidateAnswer: {
          type: String,
          default: "",
        },

        score: {
          type: Number,
          default: 0,
        },

        feedback: {
          type: String,
          default: "",
        },
      },
    ],

    totalScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "submitted", "evaluated"],
      default: "pending",
    },

    submittedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment;