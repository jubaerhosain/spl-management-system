import express from "express";
const teacherRoutes = express.Router();

import teacherController from "../controllers/teacherController.js";
import { checkAuthentication, isAdmin, isTeacher } from "../middlewares/authMiddleware.js";

// routes related to teacher account
teacherRoutes.post("/", teacherController.createTeacher);
teacherRoutes.get("/", teacherController.getAllTeacher);
teacherRoutes.get("/:teacherId", teacherController.getTeacher);
teacherRoutes.put("/:teacherId", teacherController.updateTeacher);
teacherRoutes.delete("/:teacherId", checkAuthentication, isAdmin, teacherController.deleteTeacher);

// routes related to student supervision
teacherRoutes.get("/:teacherId/student", teacherController.getAllStudentUnderSupervision);

// routes related to team supervision
teacherRoutes.get("/:teacherId/team", teacherController.getAllTeamUnderSupervision);

// routes related to team request
teacherRoutes.get("/:teacherId/request", teacherController.getAllSupervisorRequest);
teacherRoutes.put("/:teacherId/request/:requestId", teacherController.acceptSupervisorRequest);
teacherRoutes.delete("/:teacherId/request/:requestId", teacherController.rejectSupervisorRequest);

export default teacherRoutes;
