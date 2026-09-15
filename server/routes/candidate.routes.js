import express from "express";
import {
  registerCandidate,
  loginCandidate,
  logoutCandidate,
} from "../controllers/candidate.controller.js";

const candidateRouter = express.Router();

candidateRouter.route("/register").post(registerCandidate);
candidateRouter.route("/login").post(loginCandidate);
candidateRouter.route("/logout").get(logoutCandidate);

export default candidateRouter;