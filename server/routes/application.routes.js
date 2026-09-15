import express from "express";
// import { applyJob } from "../controllers/application.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { singleUpload } from "../middleware/multer.js";
import {
  applyJob,
  getAdminReviewApplications,
  getApplicationDetails,
  selectCandidate,
  rejectCandidate,
} from "../controllers/application.controller.js";

const applicationRouter = express.Router();

applicationRouter
  .route("/apply/:jobId")
  .post(isAuthenticated, singleUpload, applyJob);

applicationRouter
  .route("/admin-review")
  .get(isAuthenticated, getAdminReviewApplications);

applicationRouter
  .route("/details/:applicationId")
  .get(isAuthenticated, getApplicationDetails);

applicationRouter
  .route("/select/:applicationId")
  .put(isAuthenticated, selectCandidate);

applicationRouter
  .route("/reject/:applicationId")
  .put(isAuthenticated, rejectCandidate);

export default applicationRouter;
