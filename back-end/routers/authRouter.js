import express from "express";
const authRouter = express.Router();

import { checkAuthentication } from "../middlewares/common/checkAuthentication.js";
import { Response } from "../utils/responseUtils.js";
import authController from "../controllers/authController.js";

authRouter.post("/login", authController.doLogin);
authRouter.delete("/logout", authController.doLogout);
authRouter.put("/change-password", authController.changePassword);

authRouter.post("/generate-otp", authController.generateOTP);
authRouter.post("/verify-otp", authController.verifyOTP);
authRouter.put("/reset-password", authController.resetPassword);

authRouter.post("/check-login", checkAuthentication, (req, res) => {
    res.json(Response.success("Authenticated successfully", req.user));
});

export default authRouter;
