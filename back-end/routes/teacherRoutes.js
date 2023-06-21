import express from "express";
const teacherRouter = express.Router();

// import { addTeacherValidator } from "../validators/teacher-validators.js";
// import { commonValidationHandler } from "../validators/custom-validator.js";
// import {
//     checkAddTeacherUniqueness,
//     checkAddTeacherExistence,
// } from "../middlewares/teacher-middlewares.js";
// import { addTeacher } from "../controllers/teacher-controllers.js";

// // add one or more teachers
// teacherRouter.post(
//     "/",
//     addTeacherValidator,
//     commonValidationHandler,
//     checkAddTeacherUniqueness,
//     checkAddTeacherExistence,
//     addTeacher
// );

// // update teacher profile
// teacherRouter.put("/");

export default teacherRouter;
