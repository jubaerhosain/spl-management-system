import { Router } from "express";
const requestRouter = Router();

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

// // student requests teachers to be supervisor for spl3
// supervisorAllocationRouter.post(
//     "/request/student/:teacherId",
//     checkAuthentication,
//     authorizeStudentRequest,
//     studentRequestValidator,
//     commonValidationHandler,
//     checkStudentRequest,
//     studentRequest
// );

// // delete student request by student
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
