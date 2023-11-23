import express from "express";
const studentRoutes = express.Router();

import authMiddleware from "../middlewares/authMiddleware.js";
import studentController from "../controllers/studentController.js";

studentRoutes.post("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, studentController.createStudent);
studentRoutes.put("/", authMiddleware.checkAuthentication, studentController.updateStudent);
studentRoutes.get("/", studentController.getAllStudent);
studentRoutes.get("/:studentId", studentController.getStudent);
studentRoutes.get("/:studentId/spl", studentController.getAllSPL);
studentRoutes.get("/:studentId/spl/current", studentController.getCurrentSPL);

export default studentRoutes;
