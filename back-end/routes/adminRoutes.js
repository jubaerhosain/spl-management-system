import express from "express";
const adminRoutes = express.Router();

import adminController from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

adminRoutes.post("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, adminController.addAdmin);
adminRoutes.put("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, adminController.updateAdmin);
adminRoutes.delete("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, adminController.removeAdmin);

export default adminRoutes;
