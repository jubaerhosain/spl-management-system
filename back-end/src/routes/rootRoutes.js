import express from "express";
const apiRoutes = express.Router();

// import authRoutes from "./authRoutes.js";
import studentRoutes from "./studentRoutes.js";
import teacherRoutes from "./teacherRoutes.js";
import userRoutes from "./userRoutes.js";
import splRoutes from "./splRoutes.js";
// import teamRoutes from "./teamRoutes.js";
// import noticeRoutes from "./noticeRoutes.js";
// import presentationRoutes from "./presentationRoutes.js";

// apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/user", userRoutes);
apiRoutes.use("/student", studentRoutes); 
apiRoutes.use("/teacher", teacherRoutes); 
apiRoutes.use("/spl", splRoutes);
// apiRoutes.use("/team", teamRoutes);
// apiRoutes.use("/notice", noticeRoutes);


export default apiRoutes;
