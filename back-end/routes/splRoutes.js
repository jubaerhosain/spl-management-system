import express from "express";
const splRoutes = express.Router();

import authMiddleware from "../middlewares/authMiddleware.js";
import splValidator from "../validators/splValidator.js";
import splController from "../controllers/splController.js";

splRoutes.post(
    "/",
    authMiddleware.checkAuthentication,
    authMiddleware.isAdmin,
    splValidator.validateCreateSPLCommittee,
    splController.createSPLCommittee
);

// query param {splName}
splRoutes.post(
    "/assign",
    authMiddleware.checkAuthentication,
    authMiddleware.isAdmin,
    splController.assignStudents
);

// query param {splId, studentId}
splRoutes.delete(
    "/assign",
    authMiddleware.checkAuthentication,
    authMiddleware.isAdmin,
    splController.unassignStudent
);

// Finalize(including generating grade sheet and much more task) a Running SPL by splName
// splRouter.put("/finalize/:splName", splNameValidator, splValidationHandler, finalizeSPL);

export default splRoutes;
