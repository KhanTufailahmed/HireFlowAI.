import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import uploadFile from "../utils/uploadFile.js";

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

    const cloudResponse = await uploadFile(req.file.buffer);

    const application = await Application.create({
      candidate: candidateId,
      job: jobId,
      resumeUrl: cloudResponse.secure_url,
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      application: application,
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