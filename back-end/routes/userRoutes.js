import express from "express";
const userRoutes = express.Router();

import userController from "../controllers/userController.js";
import { checkAuthentication, isAdmin } from "../middlewares/authMiddleware.js";

// user related routes
userRoutes.post("/", checkAuthentication, isAdmin, userController.createUser);
userRoutes.get("/");
userRoutes.get("/:userId");
userRoutes.put("/:userId", checkAuthentication, userController.updateUser);
userRoutes.delete("/:userId", checkAuthentication, isAdmin, userController.deleteUser);
userRoutes.put("/:userId/avatar");
userRoutes.delete("/:userId/avatar");
userRoutes.put("/:userId/activate");
userRoutes.delete("/:userId/deactivate");

// notification related routes
userRoutes.get("/:userId/notification");
userRoutes.put("/:userId/notification");
userRoutes.delete("/:userId/notification/:notificationId");

export default userRoutes;
