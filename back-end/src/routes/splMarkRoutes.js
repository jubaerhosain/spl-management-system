import express from "express";
const markRoutes = express.Router({ mergeParams: true });

import splMarkController from "../controllers/splMarkController.js";
import { checkAuthentication } from "../middlewares/authMiddleware.js";

// atomic mark related routes
markRoutes.get("/supervisor"); // all student mark under supervisor of that spl
markRoutes.put("/supervisor", splMarkController.updateSupervisorMark);

markRoutes.get("/coding"); // all student under spl
markRoutes.put("/coding", splMarkController.updateCodingMark); // bulk for all student under spl

// continuous mark related routes
markRoutes.post("/continuous/", splMarkController.createContinuousClassWithMark);
markRoutes.get("/continuous/");
markRoutes.get("/continuous/:classNo");
markRoutes.put("/continuous/:classNo");

// atomic, continuous, presentation
markRoutes.get("/all");

export default markRoutes;
