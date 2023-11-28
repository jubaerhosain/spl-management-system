import express from "express";
const teacherRoutes = express.Router();

import teacherController from "../controllers/teacherController.js";
import { checkAuthentication, isAdmin, isTeacher } from "../middlewares/authMiddleware.js";

// routes related to teacher account
teacherRoutes.post("/", checkAuthentication, isAdmin, teacherController.createTeacher);
teacherRoutes.get("/", teacherController.getAllTeacher);
teacherRoutes.get("/:teacherId", teacherController.getTeacher);
teacherRoutes.put("/:teacherId", checkAuthentication, isTeacher, teacherController.updateTeacher);
teacherRoutes.delete("/:teacherId", checkAuthentication, isAdmin, teacherController.deleteTeacher);

// routes related to student supervision
teacherRoutes.get("/:teacherId/student", teacherController.getAllStudentUnderSupervision);

// routes related to team supervision
teacherRoutes.get("/:teacherId/team", teacherController.getAllTeamUnderSupervision);

// routes related to team request
teacherRoutes.get("/:teacherId/request/team", teacherController.getAllTeamRequestedTeacher);
teacherRoutes.put("/:teacherId/request/team", teacherController.acceptTeamRequest);
teacherRoutes.delete("/:teacherId/request/team", teacherController.rejectTeamRequest);

// routes related to student
teacherRoutes.get("/:teacherId/request/student", teacherController.getAllStudentRequestedTeacher);
teacherRoutes.put("/:teacherId/request/student", teacherController.acceptStudentRequest);
teacherRoutes.delete("/:teacherId/request/student", teacherController.rejectStudentRequest);

export default teacherRoutes;
