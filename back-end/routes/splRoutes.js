import express from "express";
const splRoutes = express.Router();

import splController from "../controllers/splController.js";
import { checkAuthentication, isAdmin } from "../middlewares/authMiddleware.js";

// spl related routes
splRoutes.post("/", checkAuthentication, isAdmin, splController.createSPL);
splRoutes.get("/:splName/active", checkAuthentication, splController.getActiveSPL);
splRoutes.get("/", checkAuthentication, splController.getAllSPL);
splRoutes.get("/:splId", checkAuthentication, splController.getSPL);
splRoutes.put("/:splId", checkAuthentication, splController.updateSPL);
splRoutes.delete("/:splId", checkAuthentication, splController.deleteSPL);

// committee related routes
splRoutes.put("/:splId/head", checkAuthentication, splController.addCommitteeHead);
splRoutes.put("/:splId/manager", checkAuthentication, splController.addSPLManager);
splRoutes.put("/:splId/member", checkAuthentication, splController.addCommitteeMember);
splRoutes.delete("/:splId/member/:memberId", checkAuthentication, splController.removeCommitteeMember);
splRoutes.delete("/:splId/head/:headId", checkAuthentication, splController.removeCommitteeHead);
splRoutes.delete("/:splId/manager/:managerId", checkAuthentication, splController.removeSPLManager);

// student related routes
splRoutes.get("/:splId/student", checkAuthentication, splController.getAllStudentUnderSPL);
splRoutes.put("/:splId/student", checkAuthentication, splController.assignStudentToSPL);
splRoutes.delete("/:splId/student/:studentId", checkAuthentication, splController.removeStudentFromSPL);

// supervisor randomization
splRoutes.post("/:splId/supervisor/randomize");

// presentation event related routes
splRoutes.post("spl/:splId/presentation"); // createPresentationEvent
splRoutes.get("spl/:splId/presentation"); 
splRoutes.delete("spl/:splId/presentation/:presentationId"); 

// continuous event related routes
splRoutes.get("spl/:splId/continuous"); 

export default splRoutes;
