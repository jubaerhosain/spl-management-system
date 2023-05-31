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
        .custom(async (email, { req }) => {
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

                // put committeeHead id to req.body
                req.body.committeeHeadId = user.userId;
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
        .custom(async (email, { req }) => {
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

                // put splManager id to req.body
                req.body.splManagerId = user.userId;
            } catch (err) {
                if (!err.status) console.log(err);
                throw new Error(err.status ? err.message : "Error checking email");
            }
        }),

    body("committeeMembers")
        .isArray()
        .withMessage("Must be an array")
        .isLength({ min: 1 })
        .withMessage("At least one member must be provided")
        .custom((committeeMembers, { req }) => {
            console.log(committeeMembers);
            if (!isUnique(committeeMembers)) {
                throw new Error("Duplicate emails are not allowed");
            }
            return true;
        }),

    body("committeeMembers.*")
        .trim()
        .isEmail()
        .withMessage("Invalid email format")
        .isLength({ max: 50 })
        .withMessage("At most 50 characters are allowed")
        .custom((memberEmail, { req }) => {
            if (isIITEmail(memberEmail)) return true;
            throw new Error("Must be end with '@iit.du.ac.bd");
        })
        .custom(async (email, { req }) => {
            try {
                const user = await models.User.findOne({
                    where: {
                        email: email,
                    },
                    raw: true,
                    attributes: ["userId", "userType", "active"],
                });

                if (!user) {
                    throw new createHttpError(400, "Email does not exist");
                }

                if (user.userType !== "teacher") {
                    throw new createHttpError(400, "Must be a teacher");
                }

                if (!user.active) {
                    throw new createHttpError(400, "Account related to this email is inactive");
                }

                // put member ids to the req
                if (!req.body.hasOwnProperty("committeeMemberIds")) {
                    req.body.committeeMemberIds = [];
                }
                req.body.committeeMemberIds.push(user.userId);
            } catch (err) {
                if (!err.status) console.log(err);
                throw new Error(err.status ? err.message : "Error checking email");
            }
        }),
];

const addCommitteeHeadValidator = [];

const removeCommitteeHeadValidator = [];

const addCommitteeMemberValidator = [];

const removeCommitteeMemberValidator = [];

export {
    createCommitteeValidator,
    addCommitteeHeadValidator,
    removeCommitteeHeadValidator,
    addCommitteeMemberValidator,
    removeCommitteeMemberValidator,
};
