import express from "express";
const teacherRoutes = express.Router();

import teacherController from "../controllers/teacherController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

teacherRoutes.post("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, teacherController.createTeacher);
teacherRoutes.get("/", teacherController.getAllTeacher);
teacherRoutes.get("/:teacherId", teacherController.getTeacher);
teacherRoutes.get("/:teacherId/student", teacherController.getAllStudentUnderSupervision);
teacherRoutes.get("/:teacherId/student/current", teacherController.getAllCurrentStudentUnderSupervision);
teacherRoutes.get("/:teacherId/team", teacherController.getAllTeamUnderSupervision);
teacherRoutes.get("/:teacherId/team/current", teacherController.getAllCurrentTeamUnderSupervision);
teacherRoutes.get("/:teacherId/request/student", teacherController.getAllStudentRequestedTeacher);
teacherRoutes.get("/:teacherId/request/team", teacherController.getAllTeamRequestedTeacher);
teacherRoutes.put("/", authMiddleware.checkAuthentication, authMiddleware.isTeacher, teacherController.updateTeacher);
teacherRoutes.delete("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, teacherController.deleteTeacher);

export default teacherRoutes;
