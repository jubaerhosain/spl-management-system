import express from "express";
const studentRouter = express.Router();

import { commonValidationHandler } from "../validators/custom-validator.js";
import { addStudentValidator } from "../validators/student-validators.js";
import { addStudent } from "../controllers/student-controllers.js";

studentRouter.post("/", addStudentValidator, commonValidationHandler, addStudent);

export default studentRouter;
