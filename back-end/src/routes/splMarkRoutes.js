import express from "express";
const markRoutes = express.Router();

import { checkAuthentication } from "../middlewares/authMiddleware.js";
import markController from "../controllers/splMarkController.js";

// atomic mark related routes
markRoutes.get("/atomic");
markRoutes.put("/atomic");

// continuous mark related routes
markRoutes.post("/continuous/"); // must bulkCreate of all student of that spl
markRoutes.get("/continuous/");
markRoutes.get("/continuous/:classNo");
markRoutes.put("/continuous/:classNo");

// 
markRoutes.get("/all");

export default markRoutes;
