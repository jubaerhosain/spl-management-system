import express from "express";
const authRoutes = express.Router();

import { checkAuthentication } from "../middlewares/authMiddleware.js";
import { GenericResponse } from "../utils/responseUtils.js";
import authValidator from "../validators/authValidator.js";
import authController from "../controllers/authController.js";

authRoutes.get("/check-authentication", checkAuthentication, (req, res) => {
    res.json(GenericResponse.success("Authenticated successfully", req.user));
});
authRoutes.post("/login", authController.login);
authRoutes.delete("/logout", authController.logout);
authRoutes.put("/change-password", checkAuthentication, authController.changePassword);
authRoutes.post("/generate-otp", authController.generateOTP);
authRoutes.post("/verify-otp", authController.verifyOTP);
authRoutes.put("/reset-password", authController.resetPassword);

export default authRoutes;
