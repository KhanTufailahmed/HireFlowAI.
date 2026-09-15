import express from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.route("/register").post(registerAdmin);
adminRouter.route("/login").post(loginAdmin);
adminRouter.route("/logout").get(logoutAdmin);

export default adminRouter;