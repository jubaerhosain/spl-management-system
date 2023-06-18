import express from "express";
const userRouter = express.Router();

import adminRouter from "./adminRouter.js";
import studentRouter from "./studentRouter.js";
import teacherRouter from "./teacherRouter.js";

userRouter.use("/admin", adminRouter);
userRouter.use("/student", studentRouter);
userRouter.use("/teacher", teacherRouter);

export default userRouter;

//==============================================================================================

import { uploadAvatar } from "../middlewares/user-middlewares.js";
import { checkAuthentication } from "../middlewares/common/check-auth-middleware.js";
import UserController from "../controllers/user-controllers.js";

// upload avatar
userRouter.post("/avatar", checkAuthentication, uploadAvatar, UserController.saveAvatar);

// // get avatar
// userRouter.get("/avatar/:fileName", getAvatar);

// // deactivate the user by admin
// userRouter.put("/deactivate/:userId", deactivateUser);

// get user by logged in
userRouter.get("/", checkAuthentication, UserController.getLoggedInUser);

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
