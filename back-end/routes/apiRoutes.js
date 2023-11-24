import express from "express";
const apiRoutes = express.Router();

import authRoutes from "./authRoutes.js";
import studentRoutes from "./studentRoutes.js";
import teacherRoutes from "./teacherRoutes.js";
import adminRoutes from "./adminRoutes.js";
import splRoutes from "./splRoutes.js";
import teamRoutes from "./teamRoutes.js";
// import userRoutes from "./userRoutes.js";
// import supervisorAllocationRouter from "./supAllocationRouter.js";
// import presentationRouter from "./presentationRouter.js";
// import markingRouter from "./markingRouter.js";

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/admin", adminRoutes);
apiRoutes.use("/student", studentRoutes); 
apiRoutes.use("/teacher", teacherRoutes); 
apiRoutes.use("/spl", splRoutes);
apiRoutes.use("/team", teamRoutes);

// apiRoutes.use("/user", userRoutes);


// mainRouter.use("/sup-allocation", supervisorAllocationRouter);

// mainRouter.use("/presentation", presentationRouter);

// mainRouter.use("/marking", markingRouter);

export default apiRoutes;
