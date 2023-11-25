import express from "express";
const userRoutes = express.Router();

import userController from "../controllers/userController.js";
import { checkAuthentication, isAdmin } from "../middlewares/authMiddleware.js";

// user related routes
userRoutes.post("/", checkAuthentication, isAdmin, userController.createUser);
userRoutes.get("/");
userRoutes.get("/:userId");
userRoutes.put("/:userId", checkAuthentication, isAdmin, userController.updateUser);
userRoutes.put("/:userId/avatar");
userRoutes.put("/:userId/activate");
userRoutes.delete("/:userId/deactivate");
userRoutes.delete("/:userId", checkAuthentication, isAdmin, userController.deleteUser);

// notification related routes
userRoutes.get("/:userId/notification");
userRoutes.put("/:userId/notification");
userRoutes.delete("/:userId/notification/:notificationId");

export default userRoutes;
