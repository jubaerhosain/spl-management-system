import express from "express";
const adminRoutes = express.Router();

import adminController from "../controllers/adminController.js";

// import { addAdminValidator } from "../validators/admin-validators.js";
// import { commonValidationHandler } from "../validators/custom-validator.js";
// import { addAdmin } from "../controllers/admin-controllers.js";

adminRoutes.post("/", adminController.addAdmin);

export default adminRoutes;
