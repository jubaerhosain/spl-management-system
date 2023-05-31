import { body, body_param, param } from "./custom-validator.js";
import { isUnique, makeUnique } from "../utilities/common-utilities.js";
import createHttpError from "http-errors";
import { models, Op } from "../database/db.js";

// import necessary validators
import { studentIdValidator } from "./student-validators.js";
import { isIITEmail } from "./user-validators.js";

const teamIdValidator = body_param("teamId").trim().isInt().withMessage("Must be an integer");

const teamNameValidator = body_param("teamName")
    .trim()
    .notEmpty()
    .withMessage("Must be provided")
    .bail()
    .matches(/^Team \d{1,2}$/)
    .withMessage("Must be in following format 'Team 1'");

const teamMemberValidator = [];

const createTeamValidator = [
    teamNameValidator,
    body("teamMembers")
        .isObject()
        .withMessage("Must be an object")
        .bail()
        .custom((members, { req }) => {
            const array = Object.entries(members);
            if (array.length == 0) {
                throw new Error("At least one member must be provided");
            }

            if (!isUnique(array)) {
                throw new Error("Duplicate emails are not allowed");
            }

            return true;
        }),

    body("teamMembers.*")
        .trim()
        .isEmail()
        .withMessage("Invalid email format")
        .bail()
        .isLength({ max: 50 })
        .withMessage("At most 50 characters are allowed")
        .bail()
        .custom((memberEmail, { req }) => {
            if (isIITEmail(memberEmail)) return true;
            throw new Error("Must be end with '@iit.du.ac.bd");
        })
        .bail()
        .custom(async (email, { req }) => {
            try {
                // from previous middleware
                const { spl } = req.body;

                const student = await models.User.findOne({
                    include: {
                        model: models.Student,
                        include: {
                            model: models.SPL,
                            through: {
                                model: models.StudentSPL,
                                attributes: [],
                            },
                            where: {
                                splId: spl.splId,
                            },
                            attributes: ["splId"],
                            required: false,
                        },
                        attributes: ["curriculumYear"],
                        required: false,
                    },
                    where: {
                        email: email,
                    },
                    raw: true,
                    nest: true,
                    attributes: ["userId", "email", "active"],
                });

                if (!student) {
                    throw new createHttpError(400, "Email does not exist");
                }

                if (student.userType !== "student") {
                    throw new createHttpError(400, "Team member must be student");
                }

                if (!student.active) {
                    throw new createHttpError(400, "Student account is inactive");
                }

                if (student.Student.curriculumYear !== "3rd") {
                    throw new createHttpError(400, "Team member must be a 3rd year student");
                }

                if (!student.Student.SPLs.splId) {
                    throw new createHttpError(400, `Team member must be a assigned to SPL2`);
                }

                // check if member of another team of same SPL or not
                const member = await models.Student.findOne({
                    include: {
                        model: models.Team,
                        through: {
                            model: models.StudentTeam,
                            attributes: [],
                        },
                        where: {
                            splId: spl.splId,
                        },
                        attributes: ["teamName"],
                        required: false,
                    },
                    where: {
                        studentId: student.userId,
                    },
                    raw: true,
                    nest: true,
                    attributes: ["studentId"],
                });

                if (member.Teams.teamName) {
                    throw new createHttpError(400, `Already member of ${member.Team.teamName}`);
                }

                // put member ids to the req
                if (!req.body.hasOwnProperty("teamMemberIds")) {
                    req.body.teamMemberIds = [];
                }
                req.body.teamMemberIds.push(student.userId);
            } catch (err) {
                if (!err.status) console.error(err.message);
                throw new Error(err.status ? err.message : "Error checking email");
            }
        }),
];

const updateTeamValidator = [teamIdValidator, teamNameValidator];

const addTeamMemberValidator = [teamIdValidator, teamMemberValidator];

const removeTeamMemberValidator = [teamIdValidator, studentIdValidator];

export {
    teamIdValidator,
    createTeamValidator,
    updateTeamValidator,
    addTeamMemberValidator,
    removeTeamMemberValidator,
};
