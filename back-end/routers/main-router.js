import express from "express";
const mainRouter = express.Router();

// internal imports
import { authenticationRouter } from "./auth-router.js";
import { userRouter } from "./user-router.js";
import { splRouter } from "./spl-router.js";
import { committeeRouter } from "./committee-router.js";
import { teamRouter } from "./team-router.js";
import { supervisorAllocationRouter } from "./sup-allocation-router.js";
import { presentationRouter } from "./presentation-router.js";
import { markingRouter } from "./marking-router.js";
import { interestedFieldRouter } from "./interested-field-router.js";

// authentication routers
mainRouter.use("/auth", authenticationRouter);

// user routers
mainRouter.use("/user", userRouter);

// spl router
mainRouter.use("/spl", splRouter);

// committee router
mainRouter.use("/committee", committeeRouter);

// supervisor allocation router
mainRouter.use("/supervisor-allocation", supervisorAllocationRouter);

// team related routes
mainRouter.use("/team", teamRouter);

// presentation related routes
mainRouter.use("/presentation", presentationRouter);

// marking related routes
mainRouter.use("/marking", markingRouter);

// interested field
mainRouter.use("/interested-field", interestedFieldRouter);

export { mainRouter };
