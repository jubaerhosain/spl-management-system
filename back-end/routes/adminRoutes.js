import express from "express";
const adminRoutes = express.Router();

import adminController from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

// adminRoutes.post("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, adminController.addAdmin);
adminRoutes.post("/", adminController.createAdminAccount);
adminRoutes.put("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, adminController.updateAdminAccount);
adminRoutes.delete("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, adminController.removeAdminAccount);

export default adminRoutes;
