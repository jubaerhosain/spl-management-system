import express from "express";
const splRoutes = express.Router();

import authMiddleware from "../middlewares/authMiddleware.js";
import splController from "../controllers/splController.js";

splRoutes.post("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, splController.createSPLCommittee);
splRoutes.get("/:splId", authMiddleware.checkAuthentication, splController.getSPL);

// query param {splName}
splRoutes.post("/assign", authMiddleware.checkAuthentication, authMiddleware.isAdmin, splController.assignStudents);

// query param {splId, studentId}
splRoutes.delete("/assign", authMiddleware.checkAuthentication, authMiddleware.isAdmin, splController.unassignStudent);

// query param {splId, teacherEmail}
splRoutes.post("/head", authMiddleware.checkAuthentication, authMiddleware.isAdmin);
splRoutes.post("/manager", authMiddleware.checkAuthentication, authMiddleware.isAdmin);
splRoutes.post("/member", authMiddleware.checkAuthentication, authMiddleware.isAdmin);

// query param {splId, teacherId}
splRoutes.delete("/head", authMiddleware.checkAuthentication, authMiddleware.isAdmin);
splRoutes.delete("/manager", authMiddleware.checkAuthentication, authMiddleware.isAdmin);
splRoutes.delete("/member", authMiddleware.checkAuthentication, authMiddleware.isAdmin);

// Finalize(including generating grade sheet and much more task) a Running SPL by splName
// splRouter.put("/finalize/:splName", splNameValidator, splValidationHandler, finalizeSPL);

export default splRoutes;
