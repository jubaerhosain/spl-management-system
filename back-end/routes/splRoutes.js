import express from "express";
const splRoutes = express.Router();

import authMiddleware from "../middlewares/authMiddleware.js";
import splController from "../controllers/splController.js";

splRoutes.post("/", authMiddleware.checkAuthentication, authMiddleware.isAdmin, splController.createSPL);
splRoutes.get("/:splName/active", authMiddleware.checkAuthentication, splController.getActiveSPL);
splRoutes.get("/", authMiddleware.checkAuthentication, splController.getAllSPL);
splRoutes.get("/:splId", authMiddleware.checkAuthentication, splController.getSPL);
splRoutes.get("/:splId/student", authMiddleware.checkAuthentication, splController.getAllStudentUnderSPL);
splRoutes.put("/:splId", authMiddleware.checkAuthentication, splController.updateSPL);
splRoutes.put("/:splId/student", authMiddleware.checkAuthentication, splController.assignStudentToSPL);
splRoutes.put("/:splId/member", authMiddleware.checkAuthentication, splController.addCommitteeMemberToSPL);
splRoutes.delete("/:splId", authMiddleware.checkAuthentication, splController.deleteSPL);
splRoutes.delete("/:splId/student/:studentId", authMiddleware.checkAuthentication, splController.removeStudentFromSPL);
splRoutes.delete("/:splId/member/:memberId", authMiddleware.checkAuthentication, splController.removeCommitteeMemberFromSPL);


export default splRoutes;
