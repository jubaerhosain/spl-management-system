import express from "express";
const studentRoutes = express.Router();

import { checkAuthentication, isAdmin, isStudent } from "../middlewares/authMiddleware.js";
import studentController from "../controllers/studentController.js";

// routes related to student account
studentRoutes.post("/", studentController.createStudent);
studentRoutes.get("/", studentController.getAllStudent);
studentRoutes.get("/:studentId", studentController.getStudent);
studentRoutes.put(
    "/:studentId",
    (req, res, next) => {
        req.user = { userType: "admin" };
        next();
    },
    studentController.updateStudent
);
// studentRoutes.delete("/:studentId", checkAuthentication, isAdmin, deleteStudent);

// routes related to spl
studentRoutes.get("/:studentId/spl", studentController.getAllSPL);

// routes related to team
studentRoutes.get("/:studentId/team", studentController.getAllTeam); 

// routes related to supervisor
studentRoutes.post("/:studentId/supervisor", studentController.assignSupervisorToStudent);
studentRoutes.get("/:studentId/supervisor"); // studentController.getAllSupervisor);
studentRoutes.delete("/:studentId/supervisor/:supervisorId");

// route related to request
studentRoutes.post("/:studentId/request", studentController.requestTeacher);
studentRoutes.get("/:studentId/request", studentController.getAllStudentRequest);
studentRoutes.delete("/:studentId/request", studentController.deleteStudentRequest);

export default studentRoutes;
