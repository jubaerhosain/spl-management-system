import express from "express";
const mainRoutes = express.Router();

import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import splRoutes from "./splRoutes.js";
// import committeeRouter from "./committeeRouter.js";
// import teamRouter from "./teamRouter.js";
// import supervisorAllocationRouter from "./supAllocationRouter.js";
// import presentationRouter from "./presentationRouter.js";
// import markingRouter from "./markingRouter.js";

mainRoutes.use("/auth", authRoutes);

mainRoutes.use("/user", userRoutes);

mainRoutes.use("/spl", splRoutes);

// committtee merge with spl ??? create spl with committtee???
// mainRouter.use("/committee", committeeRouter);

// mainRouter.use("/sup-allocation", supervisorAllocationRouter);

// mainRouter.use("/team", teamRouter);

// mainRouter.use("/presentation", presentationRouter);

// mainRouter.use("/marking", markingRouter);

export default mainRoutes;
