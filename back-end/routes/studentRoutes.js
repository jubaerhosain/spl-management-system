import express from "express";
const studentRouter = express.Router();

import studentValidator from "../validators/studentValidator.js"
import authMiddleware from "../middlewares/authMiddleware.js"

// import { commonValidationHandler } from "../validators/custom-validator.js";
// import {
//     addStudentValidator,
//     updateStudentByAdminValidator,
//     updateStudentValidator,
// } from "../validators/studentValidators.js";
// import {
//     addStudent,
//     updateStudent,
//     updateStudentByAdmin,
// } from "../controllers/student-controllers.js";
// import {
//     checkAddStudentUniqueness,
//     checkAddStudentExistence,
//     checkStudentId,
// } from "../middlewares/student-middlewares.js";

// add one or more students
studentRouter.post(
    "/",
    authMiddleware.checkAuthentication,
    authMiddleware.isAdmin,
    studentValidator.addStudent,
    (req, res) => {
        res.end("ENded add student");
    }
);

// // update student profile by student
// studentRouter.put(
//     "/",
//     (req, res, next) => {
//         req.user = {
//             userId: 1032,
//         };
//         console.log(req.user);
//         next();
//     },
//     updateStudentValidator,
//     commonValidationHandler,
//     updateStudent
// );

// // update student profile by admin
// studentRouter.put(
//     "/:studentId",
//     checkStudentId,
//     updateStudentByAdminValidator,
//     commonValidationHandler,
//     updateStudentByAdmin
// );

export default studentRouter;
