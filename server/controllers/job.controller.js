import Job from "../models/job.model.js";

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requiredSkills,
      minimumExperience,
      screeningThreshold,
      assessmentPassingScore,
    } = req.body;

    if (req.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can create jobs",
        success: false,
      });
    }

    if (!title || !description || !requiredSkills) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const job = await Job.create({
      title: title,
      description: description,
      requiredSkills: requiredSkills,
      minimumExperience: minimumExperience || 0,
      screeningThreshold: screeningThreshold || 70,
      assessmentPassingScore: assessmentPassingScore || 60,
      createdBy: req.id,
    });

    return res.status(201).json({
      message: "Job created successfully",
      job: job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      status: "active",
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      jobs: jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      job: job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
        success: false,
      });
    }

    const jobs = await Job.find({
      createdBy: req.id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      jobs: jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateJob = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
        success: false,
      });
    }

    const jobId = req.params.id;

    const {
      title,
      description,
      requiredSkills,
      minimumExperience,
      screeningThreshold,
      assessmentPassingScore,
    } = req.body;

    const job = await Job.findOne({
      _id: jobId,
      createdBy: req.id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    if (title) job.title = title;

    if (description) job.description = description;

    if (requiredSkills) job.requiredSkills = requiredSkills;

    if (minimumExperience !== undefined) {
      job.minimumExperience = minimumExperience;
    }

    if (screeningThreshold !== undefined) {
      job.screeningThreshold = screeningThreshold;
    }

    if (assessmentPassingScore !== undefined) {
      job.assessmentPassingScore = assessmentPassingScore;
    }

    await job.save();

    return res.status(200).json({
      message: "Job updated successfully",
      job: job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const closeJob = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
        success: false,
      });
    }

    const jobId = req.params.id;

    const job = await Job.findOne({
      _id: jobId,
      createdBy: req.id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    job.status = "closed";

    await job.save();

    return res.status(200).json({
      message: "Job closed successfully",
      job: job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};