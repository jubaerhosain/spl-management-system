// custom-validator.js
import { body, body_param, validationResult } from "./custom-validator.js";

// common-utilities.js
import { makeUnique } from "../utilities/common-utilities.js";

// user-validators.js
import {
    nameValidator,
    phoneNumberValidator,
    genderValidator,
    detailsValidator,
    emailArrayValidator,
} from "./user-validators.js";

// common-validators.js
import { requiredOne, checkAllow } from "../validators/common-validators.js";

// teacher attribute validators
const teacherIdValidator = body_param("teacherId").trim().isInt().withMessage("Must be an integer");

const designationValidator = body("designation")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Must be between 2 to 50 characters");

const availableValidator = body("available").trim().isBoolean().withMessage("Must be boolean");

const addTeacherValidator = [
    // check array or not and make array elements unique
    body("emails")
        .isArray()
        .withMessage("Must be an array")
        .bail()
        .isLength({ min: 1 })
        .withMessage("Cannot be empty array")
        .custom((emails, { req }) => {
            makeUnique(req.body.emails);
            return true;
        }),

    emailArrayValidator,
];

/**
 * Allowed fields to update by teacher
 */
const allowedFields = ["name", "phone", "gender", "details", "designation", "available"];

const updateTeacherValidator = [
    requiredOne,
    checkAllow(allowedFields),

    // Validate the individual fields
    nameValidator.optional(),
    phoneNumberValidator.optional(),
    genderValidator.optional(),
    detailsValidator.optional(),
    designationValidator.optional(),
    availableValidator.optional(),
];

export { teacherIdValidator, addTeacherValidator, updateTeacherValidator };
