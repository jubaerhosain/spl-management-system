import express from "express";
const authRoutes = express.Router();

import { checkAuthentication } from "../middlewares/authMiddleware.js";
import { Response } from "../utils/responseUtils.js";
import authValidator from "../validators/authValidator.js";
import authController from "../controllers/authController.js";

authRoutes.post("/login", authValidator.loginForm, authController.login);
authRoutes.delete("/logout", authController.logout);
authRoutes.put("/change-password", authController.changePassword);

authRoutes.post("/generate-otp", authController.generateOTP);
authRoutes.post("/verify-otp", authController.verifyOTP);
authRoutes.put("/reset-password", authController.resetPassword);

authRoutes.post("/check-login", checkAuthentication, (req, res) => {
    res.json(Response.success("Authenticated successfully", req.user));
});

export default authRoutes;
