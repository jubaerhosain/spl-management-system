import express from "express";
const userRoutes = express.Router();

import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

userRoutes.post("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, userController.createUser);
userRoutes.put("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, userController.updateUser);
userRoutes.delete("/:userId", authMiddleware.checkAuthentication, authMiddleware.isAdmin, userController.deleteUser);

export default userRoutes;
