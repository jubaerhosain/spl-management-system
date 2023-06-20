import { Router } from "express";
const requestRouter = Router();

import { checkSPLActivenessByName } from "../middlewares/spl-middlewares.js";
import {
    studentRequest,
    teamRequest,
    acceptStudentRequest,
    acceptTeamRequest,
} from "../controllers/request-controllers.js";

import {
    authorizeStudentRequest,
    authorizeTeamRequest,
    checkTeacherAvailability,
    checkAcceptStudentRequest,
    checkAcceptTeamRequest,
} from "../middlewares/request-middlewares.js";

import { teamIdValidator } from "../validators/team-validators.js";
import { teacherIdValidator } from "../validators/teacher-validators.js";
import { studentIdValidator } from "../validators/student-validators.js";
import { commonValidationHandler } from "../validators/custom-validator.js";

// team requests teachers to be supervisor for spl2
// [query parameters {teamId, teacherId}]
requestRouter.post(
    "/team",
    (req, res, next) => {
        // authentication
        req.user = {
            userId: 1032,
        };
        next();
    },
    teamIdValidator,
    teacherIdValidator,
    commonValidationHandler,
    authorizeTeamRequest,
    checkTeacherAvailability,
    teamRequest
);

// // delete team requst by student
// supervisorAllocationRouter.delete(
//     "/cancel-team-request/:teamId/:teacherId",
//     checkAuthentication,
//     cancelTeamRequestByStudent
// );

// accept team request [query parameters {teamId}]
requestRouter.put(
    "/team",
    // checkAuthentication,
    (req, res, next) => {
        req.user = {
            userId: 1038,
        };

        next();
    },
    teamIdValidator,
    commonValidationHandler,
    checkAcceptTeamRequest,
    acceptTeamRequest,
);

console.log("requestRouter");

// student requests teachers to be supervisor for spl3
// query parameters {teacherId}
requestRouter.post(
    "/student",
    (req, res, next) => {
        // authentication
        req.user = {
            userId: 1044,
        };

        next();
    },
    teacherIdValidator,
    commonValidationHandler,
    authorizeStudentRequest,
    checkTeacherAvailability,
    studentRequest
);

// cancel student request by student
// supervisorAllocationRouter.delete(
//     "/cancel-student-request/:teacherId",
//     checkAuthentication,
//     cancelStudentRequestByStudent
// );

// accept student request [query parameters {studentId}]
requestRouter.put(
    "/student",
    // checkAuthentication,
    (req, res, next) => {
        req.user = {
            userId: 1039,
        };

        next();
    },
    studentIdValidator,
    commonValidationHandler,
    checkAcceptStudentRequest,
    acceptStudentRequest
);

// // reject student request by receiver
// supervisorAllocationRouter.delete(
//     "/request/student/:studentId",
//     checkAuthentication,
//     rejectStudentRequest
// );

// // reject team request by receiver
// supervisorAllocationRouter.delete("/request/team/:teamId", checkAuthentication, rejectTeamRequest);

export default requestRouter;