import { Router } from "express";
const requestRouter = Router();

requestRouter.post("/team");

requestRouter.put("/team");

requestRouter.post("/student");

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
