import { body, body_param, param } from "./custom-validator.js";
import { makeUnique } from "../utilities/common-utilities.js";
import createHttpError from "http-errors";
import { models, Op } from "../database/db.js";

// import necessary validators
import { studentIdValidator } from "./student-validators.js";
import { IITEmailValidator } from "./user-validators.js";

const teamIdValidator = body_param("teamId").trim().isInt().withMessage("Must be an integer");

const teamNameValidator = body_param("teamName")
    .trim()
    .matches(/^Team \d{1,2}$/)
    .withMessage("Must be in following format 'Team 1'");

const teamMemberValidator = [];

const createTeamValidator = [
    teamNameValidator,
    body("members")
        .isArray()
        .withMessage("Must be an object")
        .bail()
        .custom((members, { req }) => {
            const length = Object.keys(members).length;
            if (length == 0) {
                throw new Error("At least one member must be provided");
            }
            return true;
        }),
    body("members.*")
        .trim()
        .isEmail()
        .withMessage("Invalid email format")
        .bail()
        .isLength({ max: 50 })
        .withMessage("At most 50 characters are allowed")
        .bail()
        .custom((memberEmail, { req }) => {
            try {
                const valid = IITEmailValidator(memberEmail);
                return true;
            } catch (err) {
                throw new Error(err.message);
            }
        })
        .bail()
        .custom(async (memberEmail, { req }) => {
            // check if the email is exist in database or not
            try {
                const student = await models.User.findOne({
                    include: {
                        model: models.Student,
                        required: true,
                        where: {
                            curriculumYear: "3rd",
                        },
                        attributes: [],
                        include: {
                            model: models.SPL,
                            through: {
                                model: models.StudentSPL,
                                attributes: [],
                            },
                            required: false,
                            where: {
                                active: true,
                                splName: "spl2",
                            },
                            attributes: ["splId", "splName", "academicYear"],
                        },
                    },
                    where: {
                        userType: "student",
                        email: memberEmail,
                    },
                    raw: true,
                    nest: true,
                    attributes: ["userId", "email", "active"],
                });

                if (!student) {
                    throw new createHttpError(400, "Email does not exist");
                }

                if (!student.active) {
                    throw new createHttpError(400, "Student account is inactive");
                }

                if (!student.Student.SPLs.splId) {
                    throw new createHttpError(400, `Not assigned to SPL2`);
                }

                // put spl to the req
                // req.body.spl = student.Student.SPLs;

                // delete nested student
                delete student.Student;

                // put retrieved members to the req
                if (!req.body.hasOwnProperty("retrievedMembers")) {
                    req.body.retrievedMembers = [];
                }
                req.body.retrievedMembers.push(student);
            } catch (err) {
                if (!err.status) console.error(err.message);
                const message = err.status ? err.message : "Internal Server Error";
                throw new Error(message);
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
