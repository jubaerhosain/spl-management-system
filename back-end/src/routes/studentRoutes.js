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
studentRoutes.delete("/:studentId", checkAuthentication, isAdmin);

// routes related to spl
studentRoutes.get("/:studentId/spl", studentController.getAllSPL);

// routes related to team
studentRoutes.get("/:studentId/team", studentController.getAllTeam);

// routes related to project (spl, (team, teamMembers));
studentRoutes.get("/:studentId/project", studentController.getAllProject);

// routes related to supervisor
studentRoutes.post("/:studentId/supervisor", studentController.assignSupervisor);
studentRoutes.delete("/:studentId/supervisor/:supervisorId", studentController.removeSupervisor);

// route related to request
studentRoutes.post("/:studentId/request", studentController.requestTeacher);
studentRoutes.delete("/:studentId/request", studentController.deleteStudentRequest);

export default studentRoutes;
