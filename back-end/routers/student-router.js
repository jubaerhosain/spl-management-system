import express from "express";
const studentRouter = express.Router();

import { commonValidationHandler } from "../validators/custom-validator.js";
import { addStudentValidator, updateStudentValidator } from "../validators/student-validators.js";
import { addStudent } from "../controllers/student-controllers.js";
import {
    checkAddStudentUniqueness,
    checkAddStudentExistence,
} from "../middlewares/student-middlewares.js";

// add one or more students
studentRouter.post(
    "/",
    addStudentValidator,
    commonValidationHandler,
    checkAddStudentUniqueness,
    checkAddStudentExistence,
    addStudent
);

// update student profile
studentRouter.put(
    "/student",
    (req, res, next) => {
        req.user = {
            userId: 1000000,
        };
    },
    updateStudentValidator,
    commonValidationHandler
);

export default studentRouter;
