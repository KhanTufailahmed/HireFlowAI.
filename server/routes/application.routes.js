import express from "express";
import { applyJob } from "../controllers/application.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { singleUpload } from "../middleware/multer.js";

const applicationRouter = express.Router();

applicationRouter
  .route("/apply/:jobId")
  .post(isAuthenticated, singleUpload, applyJob);

export default applicationRouter;
