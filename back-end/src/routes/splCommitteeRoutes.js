import express from "express";
const splCommitteeRoutes = express.Router();

import splCommitteeController from "../controllers/splCommitteeController.js";
import { checkAuthentication, isAdmin } from "../middlewares/authMiddleware.js";

splCommitteeRoutes.put("/committee/head", checkAuthentication, splCommitteeController.addCommitteeHead);
splCommitteeRoutes.delete("/committee/head/:headId", checkAuthentication, splCommitteeController.removeCommitteeHead);
splCommitteeRoutes.put("/committee/manager", checkAuthentication, splCommitteeController.addSPLManager);
splCommitteeRoutes.delete(
    "/committee/manager/:managerId",
    checkAuthentication,
    splCommitteeController.removeSPLManager
);
splCommitteeRoutes.put("/committee/member", checkAuthentication, splCommitteeController.addCommitteeMember);
splCommitteeRoutes.delete(
    "/committee/member/:memberId",
    checkAuthentication,
    splCommitteeController.removeCommitteeMember
);

export default splCommitteeRoutes;
