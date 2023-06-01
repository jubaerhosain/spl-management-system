import { Router } from "express";
const supervisorAllocationRouter = Router();

import requestRouter from "./request-router.js";

import { commonValidationHandler } from "../validators/custom-validator.js";

import {
    manualTeamAllocationValidator,
    manualStudentAllocationValidator,
    removeSupervisorValidator,
} from "../validators/sup-allocation-validators.js";

import { checkRemoveSupervisor } from "../middlewares/sup-allocation-middlewares.js";

import {
    randomizeSupervisor,
    manuallyAllocateTeamSupervisor,
    manuallyAllocateStudentSupervisor,
    removeSupervisor,
    assignManuallyByEmail,
} from "../controllers/sup-allocation-controllers.js";

import { checkAuthentication } from "../middlewares/common/check-auth-middleware.js";
import { checkSPLActivenessByName } from "../middlewares/spl-middlewares.js";

// request router setup
supervisorAllocationRouter.use("request", requestRouter);

// return middleware for spl

// randomize supervisor for students of spl1
supervisorAllocationRouter.post(
    "/randomize",
    (req, res, next) => {
        // randomization is only valid for spl1 students
        req.params.splName = "spl1";
        next();
    },
    checkSPLActivenessByName,
    randomizeSupervisor
);

// allocate supervisor manually by email
supervisorAllocationRouter.post("/assign/manually", assignManuallyByEmail);

// allocate supervisor manually to the team [spl2]
supervisorAllocationRouter.post(
    "/:splName/:teamId/:teacherId",
    manualTeamAllocationValidator,
    commonValidationHandler,
    // manualTeamAllocationDbCheck,
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
    // manualStudentAllocationDbCheck,
    commonValidationHandler,
    manuallyAllocateStudentSupervisor
);

// remove supervisor of a student [spl[1/2/3]
supervisorAllocationRouter.delete(
    "/:studentId/:teacherId",
    removeSupervisorValidator,
    commonValidationHandler,
    checkRemoveSupervisor,
    removeSupervisor
);

export default supervisorAllocationRouter;
