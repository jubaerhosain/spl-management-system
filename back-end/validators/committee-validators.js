import { isUnique, makeUnique } from "../utilities/common-utilities.js";
import createHttpError from "http-errors";
import { body_param, body, validationResult } from "./custom-validator.js";

import { isIITEmail } from "./user-validators.js";
import { models, Op } from "../database/db.js";

/**
 * Validate committeeHead, splManager and committeeMembers email
 */
const createCommitteeValidator = [
    body("committeeHead")
        .trim()
        .isEmail()
        .withMessage("Invalid email format")
        .bail()
        .isLength({ max: 50 })
        .withMessage("Must be at most 50 characters")
        .custom((email) => {
            if (isIITEmail(email)) return true;
            throw new Error("Must be end with '@iit.du.ac.bd'");
        })
        .bail()
        .custom(async (email) => {
            try {
                const user = await models.User.findOne({
                    where: {
                        email: email,
                    },
                    raw: true,
                });

                if (!user) {
                    throw new createHttpError(400, "Email does not exist");
                } else if (user.userType !== "teacher") {
                    throw new createHttpError(400, "Committee head must be a teacher");
                } else if (!user.active) {
                    throw new createHttpError(400, "Account associated with email is deactivated");
                }
            } catch (err) {
                console.log(err);
                throw new Error(err.status ? err.message : "Error checking email");
            }
        }),

    body("splManager")
        .trim()
        .isEmail()
        .withMessage("Invalid email format")
        .bail()
        .isLength({ max: 50 })
        .withMessage("Must be at most 50 characters")
        .custom((email) => {
            if (isIITEmail(email)) return true;
            throw new Error("Must be end with '@iit.du.ac.bd'");
        })
        .bail()
        .custom(async (email) => {
            try {
                const user = await models.User.findOne({
                    where: {
                        email: email,
                    },
                    raw: true,
                });

                if (!user) {
                    throw new createHttpError(400, "Email does not exist");
                } else if (user.userType !== "teacher") {
                    throw new createHttpError(400, "SPL manager must be a teacher");
                } else if (!user.active) {
                    throw new createHttpError(400, "Account associated with email is deactivated");
                }
            } catch (err) {
                console.log(err);
                throw new Error(err.status ? err.message : "Error checking email");
            }
        }),

    body("committeeMembers")
        .isArray()
        .withMessage("Must be an array")
        .isLength({ min: 1 })
        .withMessage("At least one member must be provided")
        .custom((committeeMembers, { req }) => {
            // check uniqueness
            if (!isUnique(committeeMembers)) {
                throw new Error("Duplicate emails are not allowed");
            }

            for (const email of committeeMembers) {
                if (!isIITEmail(email)) throw new Error("All email must be valid IIT email");
            }
        })
        .bail()
        .custom(async (emails) => {
            try {
                const users = await models.User.findAll({
                    where: {
                        email: {
                            [Op.in]: emails,
                            userType: "teacher",
                            active: true,
                        },
                    },
                    raw: true,
                });

                if (users.length !== emails.length) {
                    throw new createHttpError(400, "Committee members must be teacher");
                }
            } catch (err) {
                console.log(err);
                throw new Error(err.status ? err.message : "Error checking email");
            }
        }),
];

const addCommitteeHeadValidator = [];

const removeCommitteeHeadValidator = [];

const addCommitteeMemberValidator = [
];

const removeCommitteeMemberValidator = [];

export {
    createCommitteeValidator,
    addCommitteeHeadValidator,
    removeCommitteeHeadValidator,
    addCommitteeMemberValidator,
    removeCommitteeMemberValidator,
};
