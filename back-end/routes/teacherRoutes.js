import express from "express";
const teacherRoutes = express.Router();

import teacherValidator from "../validators/teacherValidator.js";
import teacherController from "../controllers/teacherController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

// import { addTeacherValidator } from "../validators/teacher-validators.js";
// import { commonValidationHandler } from "../validators/custom-validator.js";
// import {
//     checkAddTeacherUniqueness,
//     checkAddTeacherExistence,
// } from "../middlewares/teacher-middlewares.js";
// import { addTeacher } from "../controllers/teacher-controllers.js";

// add one or more teachers
teacherRoutes.post(
    "/",
    authMiddleware.checkAuthentication,
    authMiddleware.isAdmin,
    teacherValidator.addTeacherValidator,
    teacherController.addTeacher
);

// update teacher profile
teacherRoutes.put(
    "/",
    authMiddleware.checkAuthentication,
    authMiddleware.isTeacher,
    teacherValidator.updateTeacherValidator,
    teacherController.updateTeacher
);

export default teacherRoutes;
