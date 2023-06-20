import express from "express";
const authRoutes = express.Router();

import { checkAuthentication } from "../middlewares/authMiddleware.js";
import { Response } from "../utils/responseUtils.js";
import authValidator from "../validators/authValidator.js";
import authController from "../controllers/authController.js";

authRoutes.post("/login", authValidator.loginForm, authController.login);
authRoutes.delete("/logout", authController.logout);
authRoutes.put(
    "/change-password",
    checkAuthentication,
    authValidator.changePasswordForm,
    authController.changePassword
);

authRoutes.post("/generate-otp", authValidator.generateOTPForm, authController.generateOTP);
authRoutes.post("/verify-otp", authValidator.verifyOTPForm, authController.verifyOTP);
authRoutes.put("/reset-password", authValidator.resetPasswordForm, authController.resetPassword);

authRoutes.post("/check-login", checkAuthentication, (req, res) => {
    res.json(Response.success("Authenticated successfully", req.user));
});

export default authRoutes;
