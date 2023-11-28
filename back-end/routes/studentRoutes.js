import express from "express";
const studentRoutes = express.Router();

import studentController from "../controllers/studentController.js";
import { checkAuthentication, isAdmin, isStudent } from "../middlewares/authMiddleware.js";

// routes related to student account
studentRoutes.post("/", checkAuthentication, isAdmin, studentController.createStudent);
studentRoutes.get("/", studentController.getAllStudent);
studentRoutes.get("/:studentId", studentController.getStudent);
studentRoutes.put("/", checkAuthentication, isStudent, studentController.updateStudent);
studentRoutes.delete("/:studentId", checkAuthentication, isAdmin, studentController.deleteStudent);

// routes related to spl
studentRoutes.get("/:studentId/spl", studentController.getAllSPL);
studentRoutes.get("/:studentId/spl/:splName", studentController.getCurrentSPL);

// routes related to supervisor
studentRoutes.post("/:studentId/supervisor"); //studentController.assignSupervisor
studentRoutes.get("/:studentId/supervisor", studentController.getAllSupervisor);
studentRoutes.delete("/:studentId/supervisor/:supervisorId"); 

// routes related to team
studentRoutes.get("/:studentId/team", studentController.getAllTeam);
studentRoutes.get("/:studentId/team/:teamId", studentController.getCurrentTeam);

// route related to request
studentRoutes.post("/:studentId/request", studentController.requestTeacher);
studentRoutes.get("/:studentId/request", studentController.getAllRequest);
studentRoutes.delete("/:studentId/request", studentController.deleteRequest);

export default studentRoutes;
