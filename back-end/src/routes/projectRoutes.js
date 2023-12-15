import express from "express";
const projectRoutes = express.Router();

import projectController from "../controllers/projectController.js";
import { checkAuthentication, isAdmin } from "../middlewares/authMiddleware.js";

// spl related routes
projectRoutes.post("/", projectController.createProject);
projectRoutes.get("/", projectController.getAllProject);
projectRoutes.get("/:projectId", projectController.getProject);
projectRoutes.put("/:projectId", checkAuthentication, projectController.updateProject);
projectRoutes.delete("/:projectId", checkAuthentication, projectController.deleteProject);

export default projectRoutes;
