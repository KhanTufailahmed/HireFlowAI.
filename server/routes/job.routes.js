import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
  updateJob,
  closeJob,
} from "../controllers/job.controller.js";

import { isAuthenticated } from "../middleware/auth.middleware.js";

const jobRouter = express.Router();

// Candidate/Public routes
jobRouter.route("/all").get(isAuthenticated, getAllJobs);
jobRouter.route("/details/:id").get(isAuthenticated, getJobById);

// Admin routes
jobRouter.route("/create").post(isAuthenticated, createJob);
jobRouter.route("/my-jobs").get(isAuthenticated, getAdminJobs);
jobRouter.route("/update/:id").put(isAuthenticated, updateJob);
jobRouter.route("/close/:id").put(isAuthenticated, closeJob);
export default jobRouter;
