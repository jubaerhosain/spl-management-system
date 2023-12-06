import express from "express";
const studentRoutes = express.Router();

import { checkAuthentication, isAdmin, isStudent } from "../middlewares/authMiddleware.js";
import studentController from "../controllers/studentController.js";

// routes related to student account
studentRoutes.post("/", studentController.createStudent);
studentRoutes.get("/:studentId", studentController.getStudent);
studentRoutes.get("/", studentController.getAllStudent);
studentRoutes.put("/", checkAuthentication, isStudent, studentController.updateStudent);
// studentRoutes.delete("/:studentId", checkAuthentication, isAdmin, deleteStudent);

// routes related to spl
studentRoutes.get("/:studentId/spl", studentController.getAllSPL);
// studentRoutes.get("/:studentId/spl/:splId", studentController.getCurrentSPL);

// routes related to supervisor
studentRoutes.post("/:studentId/supervisor", studentController.assignSupervisorToStudent);
studentRoutes.get("/:studentId/supervisor"); // studentController.getAllSupervisor);
studentRoutes.delete("/:studentId/supervisor/:supervisorId");

// routes related to team
studentRoutes.get("/:studentId/team"); // studentController.getAllTeam);
studentRoutes.get("/:studentId/team/:teamId"); // studentController.getCurrentTeam);

// route related to request
studentRoutes.post("/:studentId/request", studentController.requestTeacher);
studentRoutes.get("/:studentId/request", studentController.getAllStudentRequest);
studentRoutes.delete("/:studentId/request", studentController.deleteStudentRequest);

export default studentRoutes;
