import express from "express";
const studentRoutes = express.Router();

import authMiddleware from "../middlewares/authMiddleware.js";
import studentController from "../controllers/studentController.js";

// routes related to student account
studentRoutes.post("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, studentController.createStudent);
studentRoutes.get("/", studentController.getAllStudent);
studentRoutes.get("/:studentId", studentController.getStudent);
studentRoutes.put("/", authMiddleware.checkAuthentication, authMiddleware.isStudent, studentController.updateStudent);
studentRoutes.delete("/:studentId", authMiddleware.checkAuthentication, authMiddleware.isAdmin, studentController.deleteStudent);

// routes related to spl
studentRoutes.get("/:studentId/spl", studentController.getAllSPL);
studentRoutes.get("/:studentId/spl/current", studentController.getCurrentSPL);

// routes related to supervisor
studentRoutes.get("/:studentId/teacher", studentController.getAllSupervisor);
studentRoutes.get("/:studentId/teacher/current", studentController.getCurrentSupervisor);

// routes related to team
studentRoutes.get("/:studentId/team", studentController.getAllTeam);
studentRoutes.get("/:studentId/team/current", studentController.getCurrentTeam);

// route related to request
studentRoutes.post('/:studentId/request', studentController.requestTeacher);
studentRoutes.get('/:studentId/request', studentController.getAllRequest);
studentRoutes.delete('/:studentId/request', studentController.deleteRequest);

// routes related to mark
studentRoutes.get("/:studentId/mark", studentController.getAllSPLMark);
studentRoutes.get("/:studentId/mark/:splName", studentController.getSPLMark);

export default studentRoutes;
