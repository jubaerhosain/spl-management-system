import createError from "http-errors";
import { body_param, body, param, validationResult } from "../custom-validator.js";
import { models, Op } from "../../database/db.js";

import { splIdExistence } from "../db-checkers/spl-db-checkers.js";


const teamNameExistence = body_param("teamName")
    .if((value, { req }) => validationResult(req).isEmpty())
    .custom(async (teamName, { req }) => {
        try {
            const team = await models.Team.findOne({
                where: {
                    teamName,
                },
            });

            if (team) {
                throw new createError("Team name already exists");
            }
        } catch (err) {
            console.log(err);
            const message = err.status ? err.message : "Internal server error.";
            throw new Error(message);
        }
    });

/**
 * Put corresponding spl to the req
 */
const teamIdExistence = body_param("teamId")
    .if((value, { req }) => validationResult(req).isEmpty())
    .custom(async (teamId, { req }) => {
        try {
            const team = await models.Team.findOne({
                include: {
                    model: models.SPL,
                    required: true,
                    attributes: ["splId", "splName", "academicYear"],
                },
                where: {
                    teamId: teamId,
                },
                raw: true,
                nest: true,
                attributes: ["teamId"],
            });

            if (!team) {
                const message = "Team doesn't exist";
                throw new createError(400, message);
            }

            // put spl to the req
            req.spl = team.SPL;
        } catch (err) {
            if (!err.status) console.log(err);
            const message = err.status ? err.message : "Internal server error.";
            throw new Error(message);
        }
    });

/**
 * Required req.spl to validate successfully
 */
const teamMemberDbCheck = [
    // check if all members curriculum year is ${curriculumYear} and are assigned to active ${splName} or not
    body("members")
        .if((value, { req }) => validationResult(req).isEmpty())
        .custom(async (members, { req }) => {
            try {
                const curriculumYear = "3rd";
                const { splId, splName } = req.spl;

                // check active, 3rd year
                let students = await models.User.findAll({
                    include: {
                        model: models.Student,
                        where: {
                            curriculumYear: "3rd",
                        },
                        attributes: [],
                        required: true,
                    },
                    where: {
                        active: true,
                        userId: {
                            [Op.in]: members,
                        },
                    },
                    raw: true,
                    attributes: ["userId"],
                });

                if (students.length !== members.length) {
                    throw new createError(400, "All must be '3rd' year students");
                }

                // check if assigned to spl or not
                students = await models.Student.findAll({
                    include: {
                        model: models.SPL,
                        through: {
                            model: models.StudentSPL,
                            attributes: [],
                        },
                        where: {
                            active: true,
                            splId: splId,
                        },
                        attributes: [],
                    },
                    where: {
                        studentId: {
                            [Op.in]: members,
                        },
                    },
                    attributes: ["studentId"],
                    raw: true,
                });

                if (members.length !== students.length) {
                    let message = `All must be assigned to ${splName.toUpperCase()}`;
                    throw new createError(400, message);
                }
            } catch (err) {
                if (!err.status) console.log(err);
                const message = err.status ? err.message : "Internal server error";
                throw new Error(message);
            }
        }),

    // check any members are member of another team of same spl or not
    body("members")
        .if((value, { req }) => validationResult(req).isEmpty())
        .custom(async (members, { req }) => {
            try {
                const { splId, splName, academicYear } = req.spl;

                // teams of current spl
                let teams = await models.Team.findAll({
                    where: {
                        splId: splId,
                    },
                    raw: true,
                    attributes: ["teamId"],
                });
                teams = teams.map((team) => team.teamId);

                // students who are members of any team of same spl
                const students = await models.StudentTeam.findAll({
                    where: {
                        studentId: {
                            [Op.in]: members,
                        },
                        teamId: {
                            [Op.in]: teams,
                        },
                    },
                    raw: true,
                    attributes: ["studentId", "teamId"],
                });

                if (students.length > 0) {
                    const message = `Must not be member of another team of ${splName.toUpperCase()}`;
                    throw new createError(400, message);
                }
            } catch (err) {
                console.log(err);
                const message = err.status ? err.message : "Internal server error.";
                throw new Error(message);
            }
        }),
];

const createTeamDbCheck = [
    splIdExistence,
    // check spl2 or not
    body_param("splId")
        .if((value, { req }) => validationResult(req).isEmpty())
        .custom((teamId, { req }) => {
            if (req.spl.splName !== "spl2") {
                throw new Error("Team creation is only allowed for SPL2");
            }
            return true;
        }),
    teamNameExistence,
    teamMemberDbCheck,
];

const updateTeamDbCheck = [teamIdExistence, teamNameExistence];

const addTeamMemberDbCheck = [teamIdExistence, teamMemberDbCheck];

// check if student is member of that spl or not
const removeTeamMemberDbCheck = [
    teamIdExistence,
    body_param("studentId")
        .if((value, { req }) => validationResult(req).isEmpty())
        .custom(async (studentId, { req }) => {
            try {
                const team = await models.StudentTeam.findOne({
                    where: {
                        teamId: req.params.teamId,
                        studentId: studentId,
                    },
                    raw: true,
                    attributes: ["teamId"],
                });

                if (!team) {
                    const message = "Not member of that team";
                    throw new createError(400, message);
                }
            } catch (err) {
                console.log(err);
                const message = err.status ? err.message : "Internal server error.";
                throw new Error(message);
            }
        }),
];

export {
    teamIdExistence,
    createTeamDbCheck,
    updateTeamDbCheck,
    addTeamMemberDbCheck,
    removeTeamMemberDbCheck,
};
