import express from "express";
const presentationRoutes = express.Router();

import presentationController from "../controllers/presentationController.js";
import { checkAuthentication, isAdmin } from "../middlewares/authMiddleware.js";

presentationRoutes.post("/", presentationController.createPresentation); 
presentationRoutes.get("/");
presentationRoutes.get("/:presentationId", presentationController.getPresentation); // getPresentation
presentationRoutes.delete("/:presentationId");

presentationRoutes.post("/:presentationId/evaluator", presentationController.addPresentationEvaluator);
presentationRoutes.get("/:presentationId/evaluator", presentationController.removePresentationEvaluator);
presentationRoutes.delete("/:presentationId/evaluator/:evaluatorId");

presentationRoutes.post("/:presentationId/mark", presentationController.addPresentationMark);
presentationRoutes.get("/:presentationId/mark");
presentationRoutes.put("/:presentationId/mark", presentationController.updatePresentationMark);


export default presentationRoutes;
