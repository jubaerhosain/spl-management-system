import express from "express";
const authenticationRouter = express.Router();

import { checkAuthentication } from "../middlewares/common/check-auth-middleware.js";
import { Response } from "../utilities/response-format-utilities.js";
import { loginValidator } from "../validators/auth-validators.js";
import { commonValidationHandler } from "../validators/custom-validator.js";
import authController from "../controllers/auth-controller.js";

authenticationRouter.post("/login", authController.doLogin);
authenticationRouter.delete("/logout", authController.doLogout);
authenticationRouter.put("/change-password", authController.changePassword);
authenticationRouter.put("/forgot-password", authController.doLogout);

authenticationRouter.post("/check-login", checkAuthentication, (req, res) => {
    res.json(Response.success("Authenticated successfully", req.user));
});

export default authenticationRouter;
