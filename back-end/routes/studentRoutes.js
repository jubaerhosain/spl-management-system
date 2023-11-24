import express from "express";
const studentRoutes = express.Router();

import authMiddleware from "../middlewares/authMiddleware.js";
import studentController from "../controllers/studentController.js";

studentRoutes.post("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, studentController.createStudent);
studentRoutes.get("/", studentController.getAllStudent);
studentRoutes.get("/:studentId", studentController.getStudent);
studentRoutes.get("/:studentId/spl", studentController.getAllSPL);
studentRoutes.get("/:studentId/spl/current", studentController.getCurrentSPL);
studentRoutes.get("/:studentId/teacher", studentController.getAllSupervisor);
studentRoutes.get("/:studentId/teacher/current", studentController.getCurrentSupervisor);
studentRoutes.get("/:studentId/team");
studentRoutes.get("/:studentId/team/current");
studentRoutes.put("/", authMiddleware.checkAuthentication, authMiddleware.isStudent, studentController.updateStudent);
studentRoutes.delete("/:studentId", authMiddleware.checkAuthentication, authMiddleware.isAdmin, studentController.deleteStudent);

export default studentRoutes;
