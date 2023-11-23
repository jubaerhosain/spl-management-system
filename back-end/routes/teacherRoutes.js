import express from "express";
const teacherRoutes = express.Router();

import teacherController from "../controllers/teacherController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

teacherRoutes.post("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, teacherController.createTeacher);

teacherRoutes.put("/", authMiddleware.checkAuthentication, authMiddleware.isTeacher, teacherController.updateTeacher);

teacherRoutes.get("/");

export default teacherRoutes;
