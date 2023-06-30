import express from "express";
const userRoutes = express.Router();

import adminRouter from "./adminRoutes.js";
import studentRouter from "./studentRoutes.js";
import teacherRouter from "./teacherRoutes.js";

userRoutes.use("/admin", adminRouter);
userRoutes.use("/student", studentRouter);
userRoutes.use("/teacher", teacherRouter);

//==============================================================================================

import authMiddleware from "../middlewares/authMiddleware.js";
import UserController from "../controllers/userController.js"


// upload avatar
// userRouter.post("/avatar", checkAuthentication, uploadAvatar, UserController.saveAvatar);

// // get avatar
// userRouter.get("/avatar/:fileName", getAvatar);

// // deactivate the user by admin
// userRouter.put("/deactivate/:userId", deactivateUser);


userRoutes.get("/", authMiddleware.checkAuthentication, UserController.getLoggedInUser);

// // get all students
// // userRouter.get("/student", getAllStudent);

// // get all students by curriculum year
// userRouter.get("/student/:curriculumYear", getStudentByCurriculumYear);

// // get students by curriculum year with supervisor
// userRouter.get("/student/:curriculumYear/supervisor", getStudentAndSupervisor);

// // get student by id
// // userRouter.get("/student/:userId", checkAuthentication, getUser);

// // get 4th year requested students
// userRouter.get("/request/student", checkAuthentication, getRequestedStudents);

// // get students as supervisor
// userRouter.get("/assigned/student", checkAuthentication, getStudentAsSupervisor);

// // get student for spl manager
// userRouter.get(
//     "/spl_manager/student/:splName",
//     checkAuthentication,
//     checkSPLManager,
//     getStudentsForSPLManager
// );

// // check curriculum year
// userRouter.get("/curriculumYear", checkAuthentication, findCurriculumYear);

// // teachers =========================
// // get all teachers
// userRouter.get("/teacher", getAllTeacher);

export default userRoutes;
