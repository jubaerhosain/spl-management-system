import express from "express";
const markRoutes = express.Router();

import { checkAuthentication } from "../middlewares/authMiddleware.js";
import markController from "../controllers/splMarkController.js";

// atomic mark related routes
markRoutes.get("/");
markRoutes.put("/");

markRoutes.get("/combined");

// presentation mark related routes
markRoutes.post("/presentation/:presentationNo"); 
markRoutes.get("/presentation/:presentationNo"); 
markRoutes.put("/presentation/:presentationNo"); 

// continuous mark related routes
markRoutes.post("/continuous/");
markRoutes.get("/continuous/");
markRoutes.get("/continuous/:classNo");
markRoutes.put("/continuous/:classNo");

export default markRoutes;
