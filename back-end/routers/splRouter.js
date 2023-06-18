import express from "express";
const splRouter = express.Router();

import { commonValidationHandler } from "../validators/custom-validator.js";

import {
    createSPL,
    removeStudent,
    assignStudentToSPL,
} from "../controllers/spl-controllers.js";

import {
    createSPLValidator,
    removeStudentValidator,
} from "../validators/spl-validators.js";

import { checkSPLActivenessByName } from "../middlewares/spl-middlewares.js";

// create SPL for new Academic Year
splRouter.post("/", createSPLValidator, commonValidationHandler, createSPL);

// delete SPL [Do it manually]

// Assign all unassigned students of a curriculumYear to corresponding SPL
splRouter.post(
    "/assign/:splName",
    checkSPLActivenessByName,
    assignStudentToSPL
);

// remove student from spl
splRouter.delete(
    "/assign/:splId/:studentId",
    removeStudentValidator,
    commonValidationHandler,
    // removeStudentDbCheck,
    commonValidationHandler,
    removeStudent
);

// assign manually ????

// Finalize(including generating grade sheet and much more task) a Running SPL by splName
// splRouter.put("/finalize/:splName", splNameValidator, splValidationHandler, finalizeSPL);

export default splRouter;
