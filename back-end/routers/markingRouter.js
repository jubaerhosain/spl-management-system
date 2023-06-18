import { Router } from "express";
const markingRouter = Router();

import { commonValidationHandler } from "../validators/custom-validator.js";

import { checkAuthentication } from "../middlewares/common/check-auth-middleware.js";

import {
    addPresentationMarkValidator,
    updatePresentationMarkValidator,
    addSupervisorMarkValidator,
    updateSupervisorMarkValidator,
    addCodingMarkValidator,
    updateCodingMarkValidator,
    addContinuousMarkValidator,
    updateContinuousMarkValidator,
} from "../validators/marking-validators.js";

import {
    addPresentationMark,
    updatePresentationMark,
    addSupervisorMark,
    updateSupervisorMark,
    addCodingMark,
    updateCodingMark,
    addContinuousMark,
    updateContinuousMark,
    getMarksByStudentId,
    getMarksByCurriculumYear,
} from "../controllers/marking-controllers.js";

import {
    checkAddPresentationMark,
    checkUpdatePresentationMark,
    checkAddSupervisorMark,
    checkAddCodingMark,
    checkUpdateCodingAndSupervisorMark,
    checkAddContinuousMark,
    checkUpdateContinuousMark,
} from "../middlewares/marking-middlewares.js";

// Rest of the code

// presentation markings
// markingRouter.post(
//     "/presentation/:presentationId/:studentId",
//     checkAuthentication,
//     addPresentationMarkValidator,
//     commonValidationHandler,
//     checkAddPresentationMark,
//     addPresentationMark
// );

// update presentation mark [Admin]
markingRouter.put(
    "/presentation/:presentationMarkId",
    updatePresentationMarkValidator,
    commonValidationHandler,
    checkUpdatePresentationMark,
    updatePresentationMark
);

// supervisor markings
markingRouter.post(
    "/supervisor/:studentId",
    checkAuthentication,
    addSupervisorMarkValidator,
    commonValidationHandler,
    checkAddSupervisorMark,
    addSupervisorMark
);

// update supervisor markings [Admin]
markingRouter.put(
    "/supervisor/:markId",
    updateSupervisorMarkValidator,
    commonValidationHandler,
    checkUpdateCodingAndSupervisorMark,
    updateSupervisorMark
);

// continuous marking
markingRouter.post(
    "/continuous/:studentId",
    checkAuthentication,
    addContinuousMarkValidator,
    commonValidationHandler,
    checkAddContinuousMark,
    addContinuousMark
);

// update continuous marking [admin]
markingRouter.put(
    "/continuous/:continuousMarkId",
    updateContinuousMarkValidator,
    commonValidationHandler,
    checkUpdateContinuousMark,
    updateContinuousMark
);

// coding markings [only for spl1 ?]
markingRouter.post(
    "/coding/:studentId",
    checkAuthentication,
    addCodingMarkValidator,
    commonValidationHandler,
    checkAddCodingMark,
    addCodingMark
);

// update coding markings
markingRouter.put(
    "/coding/:markId",
    updateCodingMarkValidator,
    commonValidationHandler,
    checkUpdateCodingAndSupervisorMark,
    updateCodingMark
);

// get marks of a student by Id
markingRouter.get("/student/:studentId", getMarksByStudentId);

// marks of all students by curriculum year
markingRouter.get("/:curriculumYear", getMarksByCurriculumYear);

export default markingRouter;
