import Assessment from "../models/assessment.model.js";
import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import evaluateAssessment from "../utils/evaluateAssessment.js";

export const getAssessment = async (req, res) => {
  try {
    if (req.role !== "candidate") {
      return res.status(403).json({
        message: "Only candidates can access assessments",
        success: false,
      });
    }

    const applicationId = req.params.applicationId;

    const assessment = await Assessment.findOne({
      application: applicationId,
      candidate: req.id,
    });

    if (!assessment) {
      return res.status(404).json({
        message: "Assessment not found",
        success: false,
      });
    }

    const questions = assessment.questions.map((item) => ({
      _id: item._id,
      question: item.question,
    }));

    return res.status(200).json({
      assessment: {
        _id: assessment._id,
        application: assessment.application,
        questions: questions,
        status: assessment.status,
      },
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

export const submitAssessment = async (req, res) => {
  try {
    if (req.role !== "candidate") {
      return res.status(403).json({
        message: "Only candidates can submit assessments",
        success: false,
      });
    }

    const assessmentId = req.params.assessmentId;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "Answers are required",
        success: false,
      });
    }

    const assessment = await Assessment.findOne({
      _id: assessmentId,
      candidate: req.id,
    });

    if (!assessment) {
      return res.status(404).json({
        message: "Assessment not found",
        success: false,
      });
    }

    if (assessment.status !== "pending") {
      return res.status(400).json({
        message: "Assessment has already been submitted",
        success: false,
      });
    }

    if (answers.length !== assessment.questions.length) {
      return res.status(400).json({
        message: "Please answer all questions",
        success: false,
      });
    }

    for (const question of assessment.questions) {
      const submittedAnswer = answers.find(
        (item) => item.questionId === question._id.toString()
      );

      if (!submittedAnswer || !submittedAnswer.answer?.trim()) {
        return res.status(400).json({
          message: "Please answer all questions",
          success: false,
        });
      }

      question.candidateAnswer = submittedAnswer.answer.trim();
    }

    assessment.status = "submitted";

    await assessment.save();

    // Gemini #3
    const evaluationResult = await evaluateAssessment(
      assessment.questions
    );

    let totalScore = 0;

    for (const question of assessment.questions) {
      const evaluation = evaluationResult.evaluations.find(
        (item) => item.questionId === question._id.toString()
      );

      if (evaluation) {
        question.score = Math.max(
          0,
          Math.min(10, evaluation.score)
        );

        question.feedback = evaluation.feedback;

        totalScore += question.score;
      }
    }

    // 5 questions × 10 marks = 50.
    // Convert to percentage.
    assessment.totalScore =
      (totalScore / (assessment.questions.length * 10)) * 100;

    assessment.status = "evaluated";
    assessment.submittedAt = new Date();

    await assessment.save();

    const application = await Application.findById(
      assessment.application
    );

    const job = await Job.findById(assessment.job);

    if (!application || !job) {
      return res.status(404).json({
        message: "Application or job not found",
        success: false,
      });
    }

    const isQualified =
      application.screening.score >= job.screeningThreshold &&
      assessment.totalScore >= job.assessmentPassingScore;

    if (isQualified) {
      application.screening.recommendation = "qualified";
      application.status = "admin_review";
    } else {
      application.screening.recommendation = "rejected";
      application.status = "rejected";
    }

    await application.save();

    return res.status(200).json({
      message: "Assessment submitted successfully",
      totalScore: assessment.totalScore,
      status: application.status,
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};