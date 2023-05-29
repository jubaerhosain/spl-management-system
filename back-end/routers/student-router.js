import express from "express";
const studentRouter = express.Router();

import { commonValidationHandler } from "../validators/custom-validator.js";
import { addStudentValidator } from "../validators/student-validators.js";
import { addStudent } from "../controllers/student-controllers.js";
import {
    checkAddStudentUniqueness,
    checkAddStudentExistence,
} from "../middlewares/student-middlewares.js";

studentRouter.post(
    "/",
    addStudentValidator,
    commonValidationHandler,
    checkAddStudentUniqueness,
    checkAddStudentExistence,
    addStudent
);

export default studentRouter;
