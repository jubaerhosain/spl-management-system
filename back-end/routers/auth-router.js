import express from "express";
const authRouter = express.Router();

import { checkAuthentication } from "../middlewares/common/check-auth-middleware.js";
import { Response } from "../utilities/response-format-utilities.js";
import authController from "../controllers/authController.js";

authenticationRouter.post("/login", authController.doLogin);
authenticationRouter.delete("/logout", authController.doLogout);
authenticationRouter.put("/change-password", authController.changePassword);

authenticationRouter.post("/generate-otp", authController.generateOTP);
authenticationRouter.post("/verify-otp", authController.verifyOTP);
authenticationRouter.put("/reset-password", authController.resetPassword);

authenticationRouter.post("/check-login", checkAuthentication, (req, res) => {
    res.json(Response.success("Authenticated successfully", req.user));
});

export default authRouter;
