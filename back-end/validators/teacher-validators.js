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
    isIITEmail,
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
    body("teachers")
        .isArray()
        .withMessage("Must be an array")
        .bail()
        .isLength({ min: 1 })
        .withMessage("Cannot be empty array"),

    body("teachers.*.name").trim().notEmpty().withMessage("Name cannot be empty"),
    body("teachers.*.email")
        .trim()
        .isEmail()
        .withMessage("Invalid email format")
        .bail()
        .isLength({ max: 50 })
        .withMessage("Must be at most 50 characters")
        .bail()
        .custom((email) => {
            if (isIITEmail(email)) return true;
            throw new Error("Must be end with '@iit.du.ac.bd");
        }),
    body("teachers.*.designation")
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Must be between 2 to 50 characters"),
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
