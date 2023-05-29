import express from "express";
const adminRouter = express.Router();

import { addAdminValidator } from "../validators/admin-validators.js";
import { commonValidationHandler } from "../validators/custom-validator.js";
import { addAdmin } from "../controllers/admin-controllers.js";

adminRouter.post("/", addAdminValidator, commonValidationHandler, addAdmin);

export default adminRouter;
