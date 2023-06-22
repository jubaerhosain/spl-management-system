import { body } from "express-validator";

import {
    validateEmail,
    validateName,
    validateRollNo,
    validateRegistrationNo,
    validateBatch,
    validateSession,
    validateGender,
    validatePhoneNumber,
} from "./common/commonValidators.js";

import {
    checkAddStudentUniqueness,
    checkAddStudentExistence,
    requiredAtLeastOneField,
    isFieldAllowed,
} from "./common/validationMiddlewares.js";

import { commonValidationHandler } from "./common/commonValidationHandler.js";

const addStudentValidator = [
    body("students")
        .isArray()
        .withMessage("Must be an array")
        .bail()
        .isLength({ min: 1 })
        .withMessage("Cannot be empty array"),

    body("students.*.name").trim().notEmpty().withMessage("Name cannot be empty"),

    body("students.*.email")
        .trim()
        .isEmail()
        .withMessage("Invalid email format")
        .bail()
        .custom((email) => {
            return validateEmail(email);
        }),

    body("students.*.rollNo")
        .trim()
        .custom((rollNo) => {
            return validateRollNo(rollNo);
        }),

    body("students.*.registrationNo")
        .trim()
        .custom((registrationNo) => {
            return validateRegistrationNo(registrationNo);
        }),

    body("students.*.batch")
        .trim()
        .custom((batch) => {
            return validateBatch(batch);
        }),

    body("students.*.session")
        .trim()
        .custom((session) => {
            return validateSession(session);
        }),

    body("students.*.curriculumYear")
        .trim()
        .custom((curriculumYear) => {
            return validateCurriculumYear(curriculumYear);
        }),

    checkAddStudentUniqueness,

    checkAddStudentExistence,
    
    commonValidationHandler,
];

/**
 * Allowed fields to update by students
 */
const allowedFieldsForStudent = ["phone", "name", "gender", "details"];

const updateStudentValidator = [
    requiredAtLeastOneField,
    isFieldAllowed(allowedFieldsForStudent),

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

    commonValidationHandler,
];

/**
 * The fields that admin are allowed to update.
 */
const allowedFieldsForAdmin = ["rollNo", "registrationNo", "batch", "session", "curriculumYear"];

const updateStudentByAdminValidator = [
    requiredAtLeastOneField,
    isFieldAllowed(allowedFieldsForAdmin),

    // rollNoValidator.optional().custom(async (rollNo) => {
    //     try {
    //         const roll = await models.Student.findOne({
    //             where: {
    //                 rollNo,
    //             },
    //             attributes: ["rollNo"],
    //             raw: true,
    //         });

    //         if (roll) {
    //             throw new createHttpError(409, "Already exists");
    //         }
    //     } catch (err) {
    //         if (err.status) console.log(err);
    //         throw new Error(err.status ? err.message : "Error checking roll number");
    //     }
    // }),

    // registrationNoValidator.optional().custom(async (registrationNo) => {
    //     try {
    //         const registration = await models.Student.findOne({
    //             where: {
    //                 registrationNo,
    //             },
    //             attributes: ["registrationNo"],
    //             raw: true,
    //         });

    //         if (registration) {
    //             throw new createHttpError(409, "Already exists");
    //         }
    //     } catch (err) {
    //         if (err.status) console.log(err);
    //         throw new Error(err.status ? err.message : "Error checking registration number");
    //     }
    // }),

    // batchValidator.optional(),
    // sessionValidator.optional(),
    // curriculumYearValidator.optional(),

    commonValidationHandler,
];

export default {
    addStudentValidator,
    updateStudentValidator,
    updateStudentByAdminValidator,
};
