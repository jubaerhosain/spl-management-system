import express from "express";
const markRoutes = express.Router();

import { checkAuthentication } from "../middlewares/authMiddleware.js";
import markController from "../controllers/splMarkController.js";

// atomic mark related routes
markRoutes.get("/supervisor"); // all student under supervisor of that spl
markRoutes.put("/supervisor");

markRoutes.get("/coding"); // all student under spl
markRoutes.put("/coding"); // bulk for all student under spl

// continuous mark related routes
markRoutes.post("/continuous/"); // must bulkCreate of all student of that spl
markRoutes.get("/continuous/");
markRoutes.get("/continuous/:classNo");
markRoutes.put("/continuous/:classNo");

// atomic, continuous, presentation
markRoutes.get("/all");

export default markRoutes;
