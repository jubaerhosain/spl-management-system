import { Router } from "express";
const requestRouter = Router();

import { checkSPLActivenessByName } from "../middlewares/spl-middlewares.js";
import { studentRequest } from "../controllers/request-controllers.js";
import { authorizeStudentRequest } from "../middlewares/request-middlewares.js";

// // team requests teachers to be supervisor for spl2
// supervisorAllocationRouter.post(
//     "/request/team/:teamId/:teacherId",
//     teamRequestValidator,
//     commonValidationHandler,
//     checkTeamRequest,
//     teamRequest
// );

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
requestRouter.post(
    "/student/:teacherId",
    (req, res, next) => {
        // authentication
        req.user = {
            userId: 1044,
        };

        next();
    },
    authorizeStudentRequest,
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
