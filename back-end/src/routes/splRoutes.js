import express from "express";
const splRoutes = express.Router();

import splMarkRoutes from "./splMarkRoutes.js";
import splController from "../controllers/splController.js";
import { checkAuthentication, isAdmin } from "../middlewares/authMiddleware.js";

// spl related routes
splRoutes.post("/", splController.createSPL);
splRoutes.get("/", splController.getAllSPL);
splRoutes.get("/:splId", splController.getSPL);
splRoutes.put("/:splId", checkAuthentication, splController.updateSPL);
splRoutes.delete("/:splId", checkAuthentication, splController.deleteSPL);

// student related routes
splRoutes.post("/:splId/student", splController.enrollStudent);
splRoutes.get("/:splId/student", splController.getAllStudentUnderSPL);
splRoutes.delete("/:splId/student/:studentId", checkAuthentication, splController.unenrollStudent);

// supervisor related
splRoutes.get("/:splId/supervisor/");
splRoutes.post("/:splId/supervisor/randomize", splController.randomizeSupervisor);

splRoutes.get("/:splId/project", splController.getAllProjectUnderSPL); 

// presentation event related routes
splRoutes.get("/:splId/presentation", splController.getAllPresentationUnderSPL);

// splMark related routes
splRoutes.use("/:splId/mark", splMarkRoutes);

export default splRoutes;
