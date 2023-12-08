import express from "express";
const splCommitteeRoutes = express.Router();

import splCommitteeController from "../controllers/splCommitteeController.js";
import { checkAuthentication, isAdmin } from "../middlewares/authMiddleware.js";

splCommitteeRoutes.post("/");
splCommitteeRoutes.get("/");
splCommitteeRoutes.get("/:committeeId");
splCommitteeRoutes.put("/:committeeId");
splCommitteeRoutes.delete("/:committeeId");

splCommitteeRoutes.put("/:committeeId/head", splCommitteeController.addCommitteeHead);
splCommitteeRoutes.delete("/:committeeId/head", splCommitteeController.removeCommitteeHead);
splCommitteeRoutes.put("/:committeeId/manager", splCommitteeController.addSPLManager);
splCommitteeRoutes.delete("/:committeeId/manager", splCommitteeController.removeSPLManager);
splCommitteeRoutes.put("/:committeeId/member", splCommitteeController.addCommitteeMember);
splCommitteeRoutes.delete("/:committeeId/member/:memberId", splCommitteeController.removeCommitteeMember);

export default splCommitteeRoutes;
