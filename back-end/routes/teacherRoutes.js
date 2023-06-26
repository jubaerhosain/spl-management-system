import express from "express";
const teacherRoutes = express.Router();

import teacherValidator from "../validators/teacherValidator.js";
import teacherController from "../controllers/teacherController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


// add one or more teachers
teacherRoutes.post(
    "/",
    authMiddleware.checkAuthentication,
    authMiddleware.isAdmin,
    teacherValidator.validateCreateTeacherAccount,
    teacherController.createTeacherAccount
);

// update teacher profile
teacherRoutes.put(
    "/",
    authMiddleware.checkAuthentication,
    authMiddleware.isTeacher,
    teacherValidator.validateUpdateTeacherAccount,
    teacherController.updateTeacherAccount
);

export default teacherRoutes;
