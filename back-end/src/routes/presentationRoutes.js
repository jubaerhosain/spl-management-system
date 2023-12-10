import express from "express";
const presentationRoutes = express.Router();

import presentationController from "../controllers/presentationController.js";
import { checkAuthentication, isAdmin } from "../middlewares/authMiddleware.js";

presentationRoutes.post("/", presentationController.createPresentationEvent); 
presentationRoutes.get("/"); // createPresentationEvent
presentationRoutes.get("/:presentationId"); // getPresentation
presentationRoutes.delete("/:presentationId");

presentationRoutes.post("/:presentationId/evaluator");
presentationRoutes.get("/:presentationId/evaluator");
presentationRoutes.delete("/:presentationId/evaluator/:evaluatorId");

presentationRoutes.post("/:presentationId/mark", presentationController.addPresentationMark);
presentationRoutes.get("/:presentationId/mark");
presentationRoutes.put("/:presentationId/mark");


export default presentationRoutes;
