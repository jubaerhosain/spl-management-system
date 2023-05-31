import { param } from "./custom-validator.js";


const randomizeSupervisorValidator = param("splName")
    .trim()
    .isIn(["spl1"])
    .withMessage("Supervisor randomization only allowed for 'spl1'");

const manualTeamAllocationValidator = [];

const manualStudentAllocationValidator = [];

const teamRequestValidator = [];

const acceptTeamRequestValidator = [];

const studentRequestValidator = [];

const acceptStudentRequestValidator = [];

const removeSupervisorValidator = [];

export {
    randomizeSupervisorValidator,
    manualTeamAllocationValidator,
    teamRequestValidator,
    acceptTeamRequestValidator,
    studentRequestValidator,
    acceptStudentRequestValidator,
    manualStudentAllocationValidator,
    removeSupervisorValidator,
};
