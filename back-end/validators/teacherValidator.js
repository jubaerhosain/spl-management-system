import { body } from "express-validator";
import { commonValidationHandler } from "./common/commonValidationHandler.js";
import { requiredAtLeastOneField, isFieldAllowed } from "./common/validationMiddlewares.js";
import {
    checkAddTeacherUniqueness,
    checkAddTeacherExistence,
} from "./common/validationMiddlewares.js";

import {
    validateEmail,
    validateName,
    validatePhoneNumber,
    validateGender,
} from "./common/commonValidators.js";

const addTeacherValidator = [
    body("teachers")
        .isArray()
        .withMessage("Must be an array")
        .bail()
        .isLength({ min: 1 })
        .withMessage("Cannot be empty array"),

    body("teachers.*.name")
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .custom((name) => {
            return validateName(name);
        }),

    body("teachers.*.email")
        .trim()
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Invalid email format")
        .custom((email) => {
            return validateEmail(email);
        }),

    body("teachers.*.designation")
        .trim()
        .trim()
        .notEmpty()
        .withMessage("Designation cannot be empty"),

    commonValidationHandler,

    checkAddTeacherUniqueness,

    checkAddTeacherExistence,
];

/**
 * Allowed fields to update by teacher
 */
const allowedFields = ["name", "phone", "gender", "details", "designation", "available"];

const updateTeacherValidator = [
    requiredAtLeastOneField,
    isFieldAllowed(allowedFields),

    // Validate the individual fields
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name must be provided")
        .bail()
        .custom((name) => {
            return validateName(name);
        })
        .optional(),

    body("gender")
        .trim()
        .notEmpty()
        .withMessage("Name must be provided")
        .custom((gender) => {
            return validateGender(gender);
        })
        .optional(),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Name must be provided")
        .custom((phone) => {
            return validatePhoneNumber(phone);
        })
        .optional(),

    body("details").trim().notEmpty().withMessage("Details must be provided").optional(),

    body("designation").trim().notEmpty().withMessage("Designation must be provided").optional(),

    body("available").trim().isBoolean().withMessage("Must be a boolean").optional(),

    commonValidationHandler,
];

export default { addTeacherValidator, updateTeacherValidator };
