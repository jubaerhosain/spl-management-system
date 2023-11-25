import express from "express";
const markRoutes = express.Router();

import { checkAuthentication } from "../middlewares/authMiddleware.js";
import markController from "../controllers/markController.js";

// mark related routes
markRoutes.put("/:markId");
markRoutes.get("/:markId");

// presentation mark related routes
markRoutes.post("/presentation/:presentationId"); 
markRoutes.put("/:markId/presentation/:presentationId"); 

// continuous mark related routes
markRoutes.post("/continuous/:weekNo");
markRoutes.put("/:markId/continuous/:weekNo");

export default markRoutes;
