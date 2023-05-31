import { Router } from "express";
const teamRouter = Router();

import { commonValidationHandler } from "../validators/custom-validator.js";

import {
    createTeamValidator,
    updateTeamValidator,
    addTeamMemberValidator,
    removeTeamMemberValidator,
} from "../validators/team-validators.js";

import {
    createTeam,
    updateTeam,
    addTeamMember,
    removeTeamMember,
    getRequestedTeams,
    getTeamByTeamMember,
    getTeamsWithMembers,
    getTeamInfoWithSuperVisor,
} from "../controllers/team-controllers.js";

import {
    updateTeamDbCheck,
    addTeamMemberDbCheck,
    removeTeamMemberDbCheck,
} from "../validators/db-checkers/team-db-checkers.js";

import { checkSPLActivenessByName } from "../middlewares/spl-middlewares.js";
import { checkAuthentication } from "../middlewares/common/check-auth-middleware.js";

// create team by committee head/member
teamRouter.post(
    "/",
    (req, res, next) => {
        // team creation is only allowed for spl2
        req.params.splName = "spl2";
        next();
    },
    checkSPLActivenessByName, 
    createTeamValidator,
    commonValidationHandler,
    createTeam
);

// update team {name, } by team member
teamRouter.put(
    "/:teamId",
    updateTeamValidator,
    commonValidationHandler,
    updateTeamDbCheck,
    commonValidationHandler,
    updateTeam
);

// add team members by committee head/member
teamRouter.put(
    "/member/:teamId",
    addTeamMemberValidator,
    commonValidationHandler,
    addTeamMemberDbCheck,
    commonValidationHandler,
    addTeamMember
);

// remove team members by committee head/member
teamRouter.delete(
    "/member/:teamId/:studentId",
    removeTeamMemberValidator,
    commonValidationHandler,
    removeTeamMemberDbCheck,
    commonValidationHandler,
    removeTeamMember
);

// get requested teams by teacher
teamRouter.get("/requested", checkAuthentication, getRequestedTeams);

// get team by teamMember
teamRouter.get("/member", checkAuthentication, getTeamByTeamMember);

teamRouter.get("/all", getTeamsWithMembers);

teamRouter.get("/all-with-supervisor", getTeamInfoWithSuperVisor);

export { teamRouter };
