import express from "express";
const adminRoutes = express.Router();

import adminController from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

adminRoutes.post("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, adminController.createAdmin);
adminRoutes.put("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, adminController.updateAdmin);
adminRoutes.delete("/:userId", authMiddleware.checkAuthentication, authMiddleware.isAdmin, adminController.deleteAdmin);

export default adminRoutes;
