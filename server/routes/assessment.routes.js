import express from "express";
import {
  getAssessment,
  submitAssessment,
} from "../controllers/assessment.controller.js";

import { isAuthenticated } from "../middleware/auth.middleware.js";

const assessmentRouter = express.Router();

assessmentRouter
  .route("/application/:applicationId")
  .get(isAuthenticated, getAssessment);

assessmentRouter
  .route("/submit/:assessmentId")
  .post(isAuthenticated, submitAssessment);

export default assessmentRouter;