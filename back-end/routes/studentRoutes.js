import express from "express";
const studentRoutes = express.Router();

import studentValidator from "../validators/studentValidator.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import studentMiddleware from "../middlewares/studentMiddleware.js";
import studentController from "../controllers/studentController.js";

// add one or more students
studentRoutes.post(
    "/",
    authMiddleware.checkAuthentication,
    authMiddleware.isAdmin,
    studentValidator.addStudentValidator,
    studentController.addStudent
);

// update student profile by student
studentRoutes.put(
    "/",
    authMiddleware.checkAuthentication,
    authMiddleware.isStudent,
    studentValidator.updateStudentValidator,
    studentController.updateStudent
);

// update student profile by admin
studentRoutes.put(
    "/:studentId",
    authMiddleware.checkAuthentication,
    authMiddleware.isAdmin,
    studentMiddleware.checkStudentExistence,
    studentValidator.updateStudentByAdminValidator
    // updateStudentByAdmin
);

export default studentRoutes;
