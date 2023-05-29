import express from "express";
const userRouter = express.Router();

import { commonValidationHandler } from "../validators/custom-validator.js";

// import validators
import {
    addStudentValidator,
    updateStudentValidator,
    updateStudentByAdminValidator,
} from "../validators/student-validators.js";

import { addTeacherValidator, updateTeacherValidator } from "../validators/teacher-validators.js";

// import db checker validators
import {
    addStudentDbCheck,
    updateStudentByAdminDbCheck,
} from "../validators/db-checkers/student-db-checkers.js";

import { addTeacherDbCheck } from "../validators/db-checkers/teacher-db-checkers.js";

// import controllers
import {
    addStudent,
    updateStudent,
    addTeacher,
    updateTeacher,
    updateStudentByAdmin,
    saveAvatar,
    deactivateUser,
    addAdmin,
    getUser,
    getAvatar,
    getStudentByCurriculumYear,
    getAllTeacher,
    getStudentAndSupervisor,
    getRequestedStudents,
    getStudentAsSupervisor,
    getStudentsForSPLManager,
    findCurriculumYear,
} from "../controllers/user-controllers.js";

// import middlewares
import { uploadAvatar } from "../middlewares/user-middlewares.js";
import { checkAuthentication } from "../middlewares/common/check-auth-middleware.js";
import { checkSPLManager } from "../middlewares/spl-middlewares.js";

// add admin
userRouter.post("/admin", addAdmin);

// add one or more student
userRouter.post(
    "/student",
    addStudentValidator,
    commonValidationHandler,
    addStudentDbCheck,
    addStudent
);

// update student profile
userRouter.put(
    "/student",
    checkAuthentication,
    updateStudentValidator,
    commonValidationHandler,
    updateStudent
);

// Update some special fields of student by admin
userRouter.put(
    "/student/:studentId",
    (req, res, next) => {
        next();
    },
    updateStudentByAdminValidator,
    commonValidationHandler,
    updateStudentByAdminDbCheck,
    commonValidationHandler,
    updateStudentByAdmin
);

// add one or more teacher
userRouter.post(
    "/teacher",
    // addTeacherValidator,
    // commonValidationHandler,
    addTeacherDbCheck,
    addTeacher
);

// update teacher profile
userRouter.put(
    "/teacher",
    checkAuthentication,
    updateTeacherValidator,
    commonValidationHandler,
    updateTeacher
);

// upload avatar
userRouter.post("/avatar", checkAuthentication, uploadAvatar, saveAvatar);

// get avatar
userRouter.get("/avatar/:fileName", getAvatar);

// deactivate the user by admin
userRouter.put("/deactivate/:userId", deactivateUser);

// get user by logged in
userRouter.get("/", checkAuthentication, getUser);

// get all students
// userRouter.get("/student", getAllStudent);

// get all students by curriculum year
userRouter.get("/student/:curriculumYear", getStudentByCurriculumYear);

// get students by curriculum year with supervisor
userRouter.get("/student/:curriculumYear/supervisor", getStudentAndSupervisor);

// get student by id
// userRouter.get("/student/:userId", checkAuthentication, getUser);

// get 4th year requested students
userRouter.get("/request/student", checkAuthentication, getRequestedStudents);

// get students as supervisor
userRouter.get("/assigned/student", checkAuthentication, getStudentAsSupervisor);

// get student for spl manager
userRouter.get(
    "/spl_manager/student/:splName",
    checkAuthentication,
    checkSPLManager,
    getStudentsForSPLManager
);

// check curriculum year
userRouter.get("/curriculumYear", checkAuthentication, findCurriculumYear);

// teachers =========================
// get all teachers
userRouter.get("/teacher", getAllTeacher);

export { userRouter };
