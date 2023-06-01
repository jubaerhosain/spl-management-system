import { Router } from "express";
const requestRouter = Router();

import { checkSPLActivenessByName } from "../middlewares/spl-middlewares.js";
import { studentRequest, teamRequest } from "../controllers/request-controllers.js";
import {
    authorizeStudentRequest,
    authorizeTeamRequest,
    checkTeacherAvailability,
} from "../middlewares/request-middlewares.js";

import { teamIdValidator } from "../validators/team-validators.js";
import { teacherIdValidator } from "../validators/teacher-validators.js";
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

// // accept team request
// supervisorAllocationRouter.put(
//     "/request/team/:teamId",
//     checkAuthentication,
//     acceptTeamRequestValidator,
//     commonValidationHandler,
//     checkAcceptTeamRequest,
//     acceptTeamRequest
// );

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

// // accept student request
// supervisorAllocationRouter.put(
//     "/request/student/:studentId",
//     checkAuthentication,
//     acceptStudentRequestValidator,
//     commonValidationHandler,
//     checkAcceptStudentRequest,
//     acceptStudentRequest
// );

// // reject student request by receiver
// supervisorAllocationRouter.delete(
//     "/request/student/:studentId",
//     checkAuthentication,
//     rejectStudentRequest
// );

// // reject team request by receiver
// supervisorAllocationRouter.delete("/request/team/:teamId", checkAuthentication, rejectTeamRequest);

export default requestRouter;
