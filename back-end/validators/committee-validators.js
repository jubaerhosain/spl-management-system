import { makeUnique } from "../utilities/common-utilities.js";
import { body_param, body } from "./custom-validator.js";

// import validators
import { teacherIdValidator } from "./teacher-validators.js";
import { IITEmailValidator } from "./user-validators.js";
import { splNameValidator } from "./spl-validators.js";

/**
 * Check if committeeId is valid or not
 */
const committeeIdValidator = body_param("committeeId")
    .trim()
    .isInt()
    .withMessage("Must be an integer");

/**
 * Validate splName, committeeHead email, committeeMembers email
 */
const createCommitteeValidator = [
    splNameValidator,
    body("committeeHead")
        .trim()
        .isEmail()
        .withMessage("Invalid email format")
        .bail()
        .isLength({ max: 50 })
        .withMessage("Must be at most 50 characters")
        .custom((email) => {
            try {
                const valid = IITEmailValidator(email);
                return true;
            } catch (err) {
                throw new Error(err.message);
            }
        }),

    body("committeeMembers")
        .isArray()
        .withMessage("Must be an array")
        .isLength({ min: 1 })
        .withMessage("At least one member must be provided")
        .custom((members, { req }) => {
            makeUnique(req.body.committeeMembers);
            return true;
        }),

    body("committeeMembers.*")
        .trim()
        .isEmail()
        .withMessage("Invalid email format")
        .bail()
        .isLength({ max: 50 })
        .withMessage("Must be at most 50 characters")
        .bail()
        .custom((email) => {
            try {
                const valid = IITEmailValidator(email);
                return true;
            } catch (err) {
                throw new Error(err.message);
            }
        }),
];

const addCommitteeHeadValidator = [committeeIdValidator, teacherIdValidator];

const removeCommitteeHeadValidator = [committeeIdValidator];

const addCommitteeMemberValidator = [
    committeeIdValidator,
    body("members")
        .isArray()
        .withMessage("Must be an array")
        .bail()
        .isLength({ min: 1 })
        .withMessage("Cannot be empty array")
        .custom((members, { req }) => {
            // make the members array unique
            makeUnique(req.body.members);
            return true;
        }),
];

const removeCommitteeMemberValidator = [committeeIdValidator, teacherIdValidator];

export {
    createCommitteeValidator,
    addCommitteeHeadValidator,
    removeCommitteeHeadValidator,
    addCommitteeMemberValidator,
    removeCommitteeMemberValidator,
};
