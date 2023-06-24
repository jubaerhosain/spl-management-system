import express from "express";
const splRoutes = express.Router();

import authMiddleware from "../middlewares/authMiddleware.js";
import splValidator from "../validators/splValidator.js";
import splController from "../controllers/splController.js";

// import {
//     createSPL,
//     removeStudent,
//     assignStudentToSPL,
// } from "../controllers/spl-controllers.js";

// import {
//     createSPLValidator,
//     removeStudentValidator,
// } from "../validators/spl-validators.js";

// import { checkSPLActivenessByName } from "../middlewares/spl-middlewares.js";

// create SPL committee
splRoutes.post(
    "/",
    authMiddleware.checkAuthentication,
    authMiddleware.isAdmin,
    splValidator.createSPLCommitteeValidator,
    splController.createSPLCommittee
);

// delete SPL [Do it manually]

// Assign all unassigned students of a curriculumYear to corresponding SPL
// splRoutes.post(
//     "/assign/:splName",
//     checkSPLActivenessByName,
//     assignStudentToSPL
// );

// remove student from spl
// splRoutes.delete(
//     "/assign/:splId/:studentId",
//     removeStudentValidator,
//     commonValidationHandler,
//     // removeStudentDbCheck,
//     commonValidationHandler,
//     removeStudent
// );

// assign manually ????

// Finalize(including generating grade sheet and much more task) a Running SPL by splName
// splRouter.put("/finalize/:splName", splNameValidator, splValidationHandler, finalizeSPL);

export default splRoutes;
