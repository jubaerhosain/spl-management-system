import express from "express";
const splRouter = express.Router();

import { commonValidationHandler } from "../validators/custom-validator.js";

import {
    createSPL,
    addSPLManager,
    removeSPLManager,
    assignStudent,
    removeStudent,
} from "../controllers/spl-controllers.js";

import {
    createSPLValidator,
    addSPLManagerValidator,
    removeSPLManagerValidator,
    assignStudentValidator,
    removeStudentValidator,
} from "../validators/spl-validators.js";

import {
    createSPLDbCheck,
    addSPLManagerDbCheck,
    removeSPLManagerDbCheck,
    assignStudentDbCheck,
    removeStudentDbCheck,
} from "../validators/db-checkers/spl-db-checkers.js";

import { checkAssignSPL, checkCreateSPL } from "../middlewares/spl-middlewares.js";

// create SPL for new Academic Year
splRouter.post(
    "/",
    createSPLValidator,
    commonValidationHandler,
    checkCreateSPL,
    createSPL
);

// delete SPL [Do it manually]

// add spl manager
splRouter.post(
    "/manager/:splId/:teacherId",
    addSPLManagerValidator,
    commonValidationHandler,
    addSPLManagerDbCheck,
    commonValidationHandler,
    addSPLManager
);

// remove spl manager
splRouter.delete(
    "/manager/:splId/",
    removeSPLManagerValidator,
    commonValidationHandler,
    removeSPLManagerDbCheck,
    commonValidationHandler,
    removeSPLManager
);

// Assign one or more students of a curriculumYear to corresponding spl
splRouter.post(
    "/assign/:splName",
    assignStudentValidator,
    commonValidationHandler,
    checkAssignSPL,
    assignStudent
);

// remove student from spl
splRouter.delete(
    "/assign/:splId/:studentId",
    removeStudentValidator,
    commonValidationHandler,
    removeStudentDbCheck,
    commonValidationHandler,
    removeStudent
);

// Finalize(including generating grade sheet and much more task) a Running SPL by splName
// splRouter.put("/finalize/:splName", splNameValidator, splValidationHandler, finalizeSPL);

export { splRouter };
