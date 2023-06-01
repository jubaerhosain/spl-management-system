import { Router } from "express";
const supervisorAllocationRouter = Router();

import { commonValidationHandler } from "../validators/custom-validator.js";

import {
    randomizeSupervisorValidator,
    teamRequestValidator,
    acceptTeamRequestValidator,
    studentRequestValidator,
    acceptStudentRequestValidator,
    manualTeamAllocationValidator,
    manualStudentAllocationValidator,
    removeSupervisorValidator,
} from "../validators/sup-allocation-validators.js";

import {
    authorizeStudentRequest,
    checkTeamRequest,
    checkAcceptTeamRequest,
    checkStudentRequest,
    checkAcceptStudentRequest,
    checkRemoveSupervisor,
} from "../middlewares/sup-allocation-middlewares.js";

import {
    randomizeSupervisor,
    teamRequest,
    acceptTeamRequest,
    studentRequest,
    acceptStudentRequest,
    manuallyAllocateTeamSupervisor,
    manuallyAllocateStudentSupervisor,
    removeSupervisor,
    rejectStudentRequest,
    rejectTeamRequest,
    cancelTeamRequestByStudent,
    cancelStudentRequestByStudent,
    assignManuallyByEmail,
} from "../controllers/sup-allocation-controllers.js";

import {
    randomizeSupervisorDbCheck,
    manualTeamAllocationDbCheck,
    manualStudentAllocationDbCheck,
} from "../validators/db-checkers/sup-allocation-db-checkers.js";

import { checkAuthentication } from "../middlewares/common/check-auth-middleware.js";

// randomize supervisor for students of spl1
supervisorAllocationRouter.post(
    "/assign/:splName",
    randomizeSupervisorValidator,
    commonValidationHandler,
    randomizeSupervisorDbCheck,
    commonValidationHandler,
    randomizeSupervisor
);

// allocate supervisor manually by email
supervisorAllocationRouter.post("/assign/manually", assignManuallyByEmail);

// allocate supervisor manually to the team [spl2]
supervisorAllocationRouter.post(
    "/assign/team/:teamId/:teacherId",
    manualTeamAllocationValidator,
    commonValidationHandler,
    manualTeamAllocationDbCheck,
    commonValidationHandler,
    manuallyAllocateTeamSupervisor
);

// allocate supervisor manually to the individual student [spl[1/2/3]]
supervisorAllocationRouter.post(
    "/assign/student/:studentId/:teacherId",
    (req, res, next) => {
        // authentication
        // admin or teacher
        next();
    },
    manualStudentAllocationValidator,
    commonValidationHandler,
    manualStudentAllocationDbCheck,
    commonValidationHandler,
    manuallyAllocateStudentSupervisor
);

// team requests teachers to be supervisor for spl2
supervisorAllocationRouter.post(
    "/request/team/:teamId/:teacherId",
    teamRequestValidator,
    commonValidationHandler,
    checkTeamRequest,
    teamRequest
);

// delete team requst by student
supervisorAllocationRouter.delete(
    "/cancel-team-request/:teamId/:teacherId",
    checkAuthentication,
    cancelTeamRequestByStudent
);

// accept team request
supervisorAllocationRouter.put(
    "/request/team/:teamId",
    checkAuthentication,
    acceptTeamRequestValidator,
    commonValidationHandler,
    checkAcceptTeamRequest,
    acceptTeamRequest
);

// student requests teachers to be supervisor for spl3
supervisorAllocationRouter.post(
    "/request/student/:teacherId",
    checkAuthentication,
    authorizeStudentRequest,
    studentRequestValidator,
    commonValidationHandler,
    checkStudentRequest,
    studentRequest
);

// delete student request by student
supervisorAllocationRouter.delete(
    "/cancel-student-request/:teacherId",
    checkAuthentication,
    cancelStudentRequestByStudent
);

// accept student request
supervisorAllocationRouter.put(
    "/request/student/:studentId",
    checkAuthentication,
    acceptStudentRequestValidator,
    commonValidationHandler,
    checkAcceptStudentRequest,
    acceptStudentRequest
);

// reject student request by receiver
supervisorAllocationRouter.delete(
    "/request/student/:studentId",
    checkAuthentication,
    rejectStudentRequest
);

// reject team request by receiver
supervisorAllocationRouter.delete("/request/team/:teamId", checkAuthentication, rejectTeamRequest);

// remove supervisor of a student [spl[1/2/3]
supervisorAllocationRouter.delete(
    "/:studentId/:teacherId",
    removeSupervisorValidator,
    commonValidationHandler,
    checkRemoveSupervisor,
    removeSupervisor
);

export default supervisorAllocationRouter;
