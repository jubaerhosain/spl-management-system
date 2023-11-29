import express from "express";
const studentRoutes = express.Router();

import studentController from "../controllers/studentController.js";
import { checkAuthentication, isAdmin, isStudent } from "../middlewares/authMiddleware.js";
import {
    createStudent,
    getStudent,
    getAllStudent,
    updateStudent,
    deleteStudent,
} from "../controllers/student/studentController.js";

import { getAllSPL } from "../controllers/student/splController.js";

// routes related to student account
studentRoutes.post("/", checkAuthentication, isAdmin, createStudent);
studentRoutes.get("/:studentId", getStudent);
studentRoutes.get("/", getAllStudent);
studentRoutes.put("/", checkAuthentication, isStudent, updateStudent);
// studentRoutes.delete("/:studentId", checkAuthentication, isAdmin, deleteStudent);

// routes related to spl
studentRoutes.get("/:studentId/spl", getAllSPL);
// studentRoutes.get("/:studentId/spl/:splId", studentController.getCurrentSPL);

// routes related to supervisor
studentRoutes.post("/:studentId/supervisor"); //studentController.assignSupervisor
studentRoutes.get("/:studentId/supervisor", studentController.getAllSupervisor);
studentRoutes.delete("/:studentId/supervisor/:supervisorId");

// routes related to team
studentRoutes.get("/:studentId/team", studentController.getAllTeam);
studentRoutes.get("/:studentId/team/:teamId", studentController.getCurrentTeam);

// route related to request
studentRoutes.post("/:studentId/request", checkAuthentication, isStudent, studentController.requestTeacher);
studentRoutes.get("/:studentId/request", studentController.getAllRequest);
studentRoutes.delete("/:studentId/request", studentController.deleteRequest);

export default studentRoutes;
