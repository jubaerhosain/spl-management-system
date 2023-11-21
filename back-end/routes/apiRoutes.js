import express from "express";
const apiRoutes = express.Router();

import authRoutes from "./authRoutes.js";
import studentRoutes from "./studentRoutes.js";
import teacherRoutes from "./teacherRoutes.js";
import adminRoutes from "./adminRoutes.js";
// import userRoutes from "./userRoutes.js";
// import splRoutes from "./splRoutes.js";
// import committeeRouter from "./committeeRouter.js";
// import teamRouter from "./teamRouter.js";
// import supervisorAllocationRouter from "./supAllocationRouter.js";
// import presentationRouter from "./presentationRouter.js";
// import markingRouter from "./markingRouter.js";

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/admin", adminRoutes);
apiRoutes.use("/student", studentRoutes); 
apiRoutes.use("/teacher", teacherRoutes); 

// apiRoutes.use("/user", userRoutes);

// apiRoutes.use("/spl", splRoutes);

// committtee merge with spl ??? create spl with committtee???
// mainRouter.use("/committee", committeeRouter);

// mainRouter.use("/sup-allocation", supervisorAllocationRouter);

// mainRouter.use("/team", teamRouter);

// mainRouter.use("/presentation", presentationRouter);

// mainRouter.use("/marking", markingRouter);

export default apiRoutes;
