import express from "express";
const authRoutes = express.Router();

import { checkAuthentication } from "../middlewares/authMiddleware.js";
import authController from "../controllers/authController.js";

authRoutes.post("/login", authController.login);
authRoutes.get("/");
authRoutes.delete("/logout", authController.logout);

authRoutes.put("/change-password", checkAuthentication, authController.changePassword);

authRoutes.post("/forgot-password/generate-otp", authController.generateOTP);
authRoutes.put("/forgot-password/verify-otp", authController.verifyOTP);
authRoutes.put("/forgot-password/reset-password", authController.resetPassword);

export default authRoutes;
