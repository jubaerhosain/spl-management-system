import express from "express";
const mainRouter = express.Router();

// internal imports
import authenticationRouter from "./authRouter.js";
// import userRouter from "./userRouter.js";
// import splRouter from "./splRouter.js";
// import committeeRouter from "./committeeRouter.js";
// import teamRouter from "./teamRouter.js";
// import supervisorAllocationRouter from "./supAllocationRouter.js";
// import presentationRouter from "./presentationRouter.js";
// import markingRouter from "./markingRouter.js";

// authentication routers
mainRouter.use("/auth", authenticationRouter);

// user routers
// mainRouter.use("/user", userRouter);

// spl router
// mainRouter.use("/spl", splRouter);

// committee router
// mainRouter.use("/committee", committeeRouter);

// supervisor allocation router
// mainRouter.use("/sup-allocation", supervisorAllocationRouter);

// team related routes
// mainRouter.use("/team", teamRouter);

// presentation related routes
// mainRouter.use("/presentation", presentationRouter);

// marking related routes
// mainRouter.use("/marking", markingRouter);

export default mainRouter;
