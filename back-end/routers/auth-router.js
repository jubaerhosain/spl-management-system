import express from "express";
const authenticationRouter = express.Router();

import { checkAuthentication } from "../middlewares/common/check-auth-middleware.js";
import { Response } from "../utilities/response-format-utilities.js";
import { loginValidator } from "../validators/auth-validators.js";
import { commonValidationHandler } from "../validators/custom-validator.js";
import { doLogin, doLogout } from "../controllers/auth-controllers.js";

authenticationRouter.use("/login", loginValidator, commonValidationHandler, doLogin);
authenticationRouter.use("/logout", doLogout);

authenticationRouter.post("/check-login", checkAuthentication, (req, res) => {
    res.json(Response.success("Authenticated successfully", req.user));
});

export default authenticationRouter;
