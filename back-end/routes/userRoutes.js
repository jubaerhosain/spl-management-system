import express from "express";
const userRoutes = express.Router();

import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

// user related routes
userRoutes.post("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, userController.createUser);
userRoutes.get("/");
userRoutes.get("/:userId");
userRoutes.put("/:userId", authMiddleware.checkAuthentication, authMiddleware.isAdmin, userController.updateUser);
userRoutes.put("/:userId/avatar");
userRoutes.put("/:userId/activate");
userRoutes.put("/:userId/deactivate");
userRoutes.delete("/:userId", authMiddleware.checkAuthentication, authMiddleware.isAdmin, userController.deleteUser);

// notification related routes
userRoutes.get("/:userId/notification");
userRoutes.put("/:userId/notification");
userRoutes.delete("/:userId/notification/:notificationId");

export default userRoutes;
