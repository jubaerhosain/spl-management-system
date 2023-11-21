import express from "express";
const teacherRoutes = express.Router();

import teacherController from "../controllers/teacherController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

teacherRoutes.post("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, teacherController.createTeacherAccount);

teacherRoutes.put("/", authMiddleware.checkAuthentication, authMiddleware.isTeacher, teacherController.updateTeacherAccount);

teacherRoutes.get("/");

export default teacherRoutes;
