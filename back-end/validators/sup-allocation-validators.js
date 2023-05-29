import { param } from "./custom-validator.js";

import { teamIdValidator } from "../validators/team-validators.js";
import { teacherIdValidator } from "../validators/teacher-validators.js";
import { studentIdValidator } from "../validators/student-validators.js";


const randomizeSupervisorValidator = param("splName")
    .trim()
    .isIn(["spl1"])
    .withMessage("Supervisor randomization only allowed for 'spl1'");

const manualTeamAllocationValidator = [teamIdValidator, teacherIdValidator];

const manualStudentAllocationValidator = [studentIdValidator, teacherIdValidator];

const teamRequestValidator = [teamIdValidator, teacherIdValidator];

const acceptTeamRequestValidator = teamIdValidator;

const studentRequestValidator = teacherIdValidator;

const acceptStudentRequestValidator = studentIdValidator;

const removeSupervisorValidator = [studentIdValidator, teacherIdValidator];

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
