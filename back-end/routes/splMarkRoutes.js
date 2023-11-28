import express from "express";
const markRoutes = express.Router();

import { checkAuthentication } from "../middlewares/authMiddleware.js";
import markController from "../controllers/splMarkController.js";

// mark related routes
markRoutes.put("/:markId");
markRoutes.get("/");

// presentation mark related routes
markRoutes.post("/presentation/:presentationId"); 
markRoutes.get("/presentation/:presentationId"); 
markRoutes.put("/:markId/presentation/:presentationId"); 

// continuous mark related routes
markRoutes.post("/continuous/:weekNo");
markRoutes.get("/continuous/:weekNo");
markRoutes.put("/:markId/continuous/:weekNo");

export default markRoutes;
