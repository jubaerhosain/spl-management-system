import express from "express";
const presentationRoutes = express.Router();

import { checkAuthentication, isAdmin } from "../middlewares/authMiddleware.js";

presentationRoutes.post("/presentation"); // createPresentationEvent
presentationRoutes.get("/presentation/:presentationId"); // getPresentation
presentationRoutes.delete("/presentation/:presentationId");

presentationRoutes.post("/presentation/:presentationId/evaluator");
presentationRoutes.get("/presentation/:presentationId/evaluator");
presentationRoutes.delete("/presentation/:presentationId/evaluator/:evaluatorId");

presentationRoutes.post("/presentation/:presentationId/mark");
presentationRoutes.get("/presentation/:presentationId/mark");
presentationRoutes.put("/presentation/:presentationId/mark");


export default presentationRoutes;
