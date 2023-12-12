import express from "express";
const splRoutes = express.Router();

import splMarkRoutes from "./splMarkRoutes.js";
import splController from "../controllers/splController.js";
import { checkAuthentication, isAdmin } from "../middlewares/authMiddleware.js";

// spl related routes
splRoutes.post("/", splController.createSPL);
splRoutes.get("/", checkAuthentication, splController.getAllSPL);
splRoutes.get("/:splName/active", checkAuthentication, splController.getActiveSPL);
splRoutes.get("/:splId", checkAuthentication, splController.getSPL);
splRoutes.put("/:splId", checkAuthentication, splController.updateSPL);
splRoutes.delete("/:splId", checkAuthentication, splController.deleteSPL);

// student related routes
splRoutes.post("/:splId/student", splController.assignStudentToSPL);
splRoutes.get("/:splId/student", checkAuthentication, splController.getAllStudentUnderSPL);
splRoutes.delete("/:splId/student/:studentId", checkAuthentication, splController.removeStudentFromSPL);

// supervisor related
splRoutes.get("/:splId/supervisor/", checkAuthentication);
splRoutes.post("/:splId/supervisor/randomize", splController.randomizeSupervisor);

// presentation event related routes
splRoutes.get("/:splId/presentation");

splRoutes.post("/:splId/presentation/evaluator");
splRoutes.get("/:splId/presentation/evaluator");
splRoutes.delete("/:splId/presentation/evaluator/:evaluatorId");

splRoutes.use("/:splId/mark", splMarkRoutes);

export default splRoutes;
