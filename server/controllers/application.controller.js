import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import uploadFile from "../utils/uploadFile.js";
import screenResume from "../utils/screenResume.js";
import Assessment from "../models/assessment.model.js";
import generateAssessment from "../utils/generateAssessment.js";
import Interview from "../models/interview.model.js";
import sendInterviewEmail from "../utils/sendInterviewEmail.js";

// export const applyJob = async (req, res) => {
//   try {
//     const candidateId = req.id;
//     const jobId = req.params.jobId;

//     if (req.role !== "candidate") {
//       return res.status(403).json({
//         message: "Only candidates can apply for jobs",
//         success: false,
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({
//         message: "Resume is required",
//         success: false,
//       });
//     }

//     const job = await Job.findById(jobId);

//     if (!job) {
//       return res.status(404).json({
//         message: "Job not found",
//         success: false,
//       });
//     }

//     if (job.status !== "active") {
//       return res.status(400).json({
//         message: "This job is no longer accepting applications",
//         success: false,
//       });
//     }

//     const existingApplication = await Application.findOne({
//       candidate: candidateId,
//       job: jobId,
//     });

//     if (existingApplication) {
//       return res.status(400).json({
//         message: "You have already applied for this job",
//         success: false,
//       });
//     }

//     // const cloudResponse = await uploadFile(req.file.buffer);

//     // const application = await Application.create({
//     //   candidate: candidateId,
//     //   job: jobId,
//     //   resumeUrl: cloudResponse.secure_url,
//     // });
//     const cloudResponse = await uploadFile(req.file.buffer);

//     const screeningResult = await screenResume(req.file.buffer, job);

//     const isQualified =
//       screeningResult.screening.score >= job.screeningThreshold;

//     const application = await Application.create({
//       candidate: candidateId,
//       job: jobId,

//       resumeUrl: cloudResponse.secure_url,

//       resumeData: screeningResult.resumeData,

//       screening: {
//         matchedSkills: screeningResult.screening.matchedSkills,
//         missingSkills: screeningResult.screening.missingSkills,
//         score: screeningResult.screening.score,
//         summary: screeningResult.screening.summary,
//         recommendation: isQualified ? "qualified" : "rejected",
//       },

//       status: isQualified ? "admin_review" : "rejected",
//     });

//     return res.status(201).json({
//       message: "Application submitted successfully",
//       application: application,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       message: "Something went wrong",
//       success: false,
//     });
//   }
// };

export const applyJob = async (req, res) => {
  try {
    const candidateId = req.id;
    const jobId = req.params.jobId;

    if (req.role !== "candidate") {
      return res.status(403).json({
        message: "Only candidates can apply for jobs",
        success: false,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Resume is required",
        success: false,
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    if (job.status !== "active") {
      return res.status(400).json({
        message: "This job is no longer accepting applications",
        success: false,
      });
    }

    const existingApplication = await Application.findOne({
      candidate: candidateId,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    // Upload resume to Cloudinary
    const cloudResponse = await uploadFile(req.file.buffer);

    // Extract and screen resume using Gemini
    const screeningResult = await screenResume(req.file.buffer, job);

    // Create application
    const application = await Application.create({
      candidate: candidateId,
      job: jobId,

      resumeUrl: cloudResponse.secure_url,

      resumeData: screeningResult.resumeData,

      screening: {
        matchedSkills: screeningResult.screening.matchedSkills,
        missingSkills: screeningResult.screening.missingSkills,
        score: screeningResult.screening.score,
        summary: screeningResult.screening.summary,

        recommendation: "pending",
      },

      status: "applied",
    });

    const generatedAssessment = await generateAssessment(
      job,
      screeningResult.resumeData,
      screeningResult.screening,
    );

    if (
      !generatedAssessment.questions ||
      generatedAssessment.questions.length !== 5
    ) {
      return res.status(500).json({
        message: "Failed to generate assessment",
        success: false,
      });
    }

    const assessment = await Assessment.create({
      application: application._id,
      candidate: candidateId,
      job: jobId,
      questions: generatedAssessment.questions,
    });

    
    return res.status(201).json({
      message: "Application submitted and assessment generated successfully",
      application: application,
    //   assessment: assessment, 
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


export const getAdminReviewApplications = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can access applications",
        success: false,
      });
    }

    const applications = await Application.find({
      status: "admin_review",
    })
      .populate("candidate", "name email phone")
      .populate("job", "title requiredSkills screeningThreshold");

    return res.status(200).json({
      applications: applications,
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


export const getApplicationDetails = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can access applications",
        success: false,
      });
    }

    const applicationId = req.params.applicationId;

    const application = await Application.findById(applicationId)
      .populate("candidate", "name email phone")
      .populate("job");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    const assessment = await Assessment.findOne({
      application: applicationId,
    });

    return res.status(200).json({
      application: application,
      assessment: assessment,
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


// export const selectCandidate = async (req, res) => {
//   try {
//     if (req.role !== "admin") {
//       return res.status(403).json({
//         message: "Only admin can select candidates",
//         success: false,
//       });
//     }

//     const applicationId = req.params.applicationId;

//     const application = await Application.findOne({
//       _id: applicationId,
//       status: "admin_review",
//     });

//     if (!application) {
//       return res.status(404).json({
//         message: "Application not found or not available for review",
//         success: false,
//       });
//     }
//      const interviewDate = new Date();

//     interviewDate.setDate(interviewDate.getDate() + 2);
//     interviewDate.setHours(11, 0, 0, 0);

//     const interview = await Interview.create({
//       application: application._id,
//       candidate: application.candidate._id,
//       job: application.job._id,
//       interviewDate: interviewDate,
//       mode: "online",
//     });

//     await sendInterviewEmail(
//       application.candidate,
//       application.job,
//       interview
//     );

//     application.status = "interview_scheduled";

//     await application.save();

//     return res.status(200).json({
//       message: "Candidate selected and interview scheduled successfully",
//       application: application,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       message: "Something went wrong",
//       success: false,
//     });
//   }
// };

export const selectCandidate = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can select candidates",
        success: false,
      });
    }

    const applicationId = req.params.applicationId;

    const application = await Application.findOne({
      _id: applicationId,
      status: "admin_review",
    })
      .populate("candidate", "name email phone")
      .populate("job");

    if (!application) {
      return res.status(404).json({
        message: "Application not found or not available for review",
        success: false,
      });
    }

    // Automatically schedule interview 2 days later
    const interviewDate = new Date();

    interviewDate.setDate(interviewDate.getDate() + 2);
    interviewDate.setHours(11, 0, 0, 0);

    const interview = await Interview.create({
      application: application._id,
      candidate: application.candidate._id,
      job: application.job._id,
      interviewDate: interviewDate,
      mode: "online",
    });

    await sendInterviewEmail(
      application.candidate,
      application.job,
      interview
    );

    application.status = "interview_scheduled";

    await application.save();

    return res.status(200).json({
      message:
        "Candidate selected and interview scheduled successfully",
      interview: interview,
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

export const rejectCandidate = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can reject candidates",
        success: false,
      });
    }

    const applicationId = req.params.applicationId;

    const application = await Application.findOne({
      _id: applicationId,
      status: "admin_review",
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found or not available for review",
        success: false,
      });
    }

    application.status = "rejected";

    await application.save();

    return res.status(200).json({
      message: "Candidate rejected successfully",
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