import express from "express";
const mainRoutes = express.Router();

import authRoutes from "./authRoutes.js";
// import userRouter from "./userRouter.js";
// import splRouter from "./splRouter.js";
// import committeeRouter from "./committeeRouter.js";
// import teamRouter from "./teamRouter.js";
// import supervisorAllocationRouter from "./supAllocationRouter.js";
// import presentationRouter from "./presentationRouter.js";
// import markingRouter from "./markingRouter.js";

mainRoutes.use("/auth", authRoutes);

// mainRouter.use("/user", userRouter);

// mainRouter.use("/spl", splRouter);

// mainRouter.use("/committee", committeeRouter);

// mainRouter.use("/sup-allocation", supervisorAllocationRouter);

// mainRouter.use("/team", teamRouter);

// mainRouter.use("/presentation", presentationRouter);

// mainRouter.use("/marking", markingRouter);

export default mainRoutes;
