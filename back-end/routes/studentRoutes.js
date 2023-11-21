import express from "express";
const studentRoutes = express.Router();

import authMiddleware from "../middlewares/authMiddleware.js";
import studentController from "../controllers/studentController.js";

studentRoutes.post("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, studentController.createStudentAccount);

studentRoutes.put("/", authMiddleware.checkAuthentication, studentController.updateStudentAccount);

studentRoutes.get("/");

export default studentRoutes;
