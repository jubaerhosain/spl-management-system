import express from "express";
const splRoutes = express.Router();

import splMarkRoutes from "./splMarkRoutes.js";
import splController from "../controllers/splController.js";
import { checkAuthentication, isAdmin } from "../middlewares/authMiddleware.js";

// spl related routes
splRoutes.post("/", checkAuthentication, isAdmin, splController.createSPL);
splRoutes.get("/", checkAuthentication, splController.getAllSPL);
splRoutes.get("/:splName/active", checkAuthentication, splController.getActiveSPL);
splRoutes.get("/:splId", checkAuthentication, splController.getSPL);
splRoutes.put("/:splId", checkAuthentication, splController.updateSPL);
splRoutes.delete("/:splId", checkAuthentication, splController.deleteSPL);

// committee related routes
splRoutes.put("/:splId/head", checkAuthentication, splController.addCommitteeHead);
splRoutes.delete("/:splId/head/:headId", checkAuthentication, splController.removeCommitteeHead);
splRoutes.put("/:splId/manager", checkAuthentication, splController.addSPLManager);
splRoutes.delete("/:splId/manager/:managerId", checkAuthentication, splController.removeSPLManager);
splRoutes.put("/:splId/member", checkAuthentication, splController.addCommitteeMember);
splRoutes.delete("/:splId/member/:memberId", checkAuthentication, splController.removeCommitteeMember);

// student related routes
splRoutes.get("/:splId/student", checkAuthentication, splController.getAllStudentUnderSPL);
splRoutes.put("/:splId/student", checkAuthentication, splController.assignStudentToSPL);
splRoutes.delete("/:splId/student/:studentId", checkAuthentication, splController.removeStudentFromSPL);

// supervisor randomization
splRoutes.post("/:splId/supervisor/randomize");

// presentation event related routes
splRoutes.post("/:splId/presentation"); // createPresentationEvent
splRoutes.get("/:splId/presentation"); 
splRoutes.delete("/:splId/presentation/:presentationId"); 

splRoutes.post("/:splId/presentation/evaluator"); 
splRoutes.get("/:splId/presentation/evaluator"); 
splRoutes.delete("/:splId/presentation/evaluator/:evaluatorId"); 

// spl mark related routes
splRoutes.get("/:splId/mark", splMarkRoutes); 

export default splRoutes;
