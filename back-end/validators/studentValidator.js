import { body } from "express-validator";

import { validateEmail } from "./common/commonValidators.js";
import { commonValidationHandler } from "./common/commonValidationHandler.js";

import {
    checkAddStudentExistence,
    checkAddStudentUniqueness,
} from "../middlewares/studentMiddleware.js";

const validateRollNo = (rollNo) => {
    const regex = /^[0-9]{4}$/;
    const isValid = regex.test(rollNo);

    if (isValid) {
        return true;
    } else {
        throw new Error("Must be a 4 digit number");
    }
};

const validateRegistrationNo = (registrationNo) => {
    const regex = /^[0-9]{10}$/;
    const isValid = regex.test(registrationNo);

    if (isValid) {
        return true;
    } else {
        throw new Error("Must be a 10 digit number");
    }
};

const validateBatch = (batch) => {
    const regex = /^[0-9]{2}$/;
    const isValid = regex.test(batch);

    if (isValid) {
        return true;
    } else {
        throw new Error("Must be a 2 digit number");
    }
};

const validateSession = (session) => {
    const regex = /^[0-9]{4}-[0-9]{2}$/;
    const isValid = regex.test(session);

    if (isValid) {
        return true;
    } else {
        throw new Error("Must be in following format: '2018-19'");
    }
};

const validateCurriculumYear = (curriculumYear) => {
    const options = ["1st", "2nd", "3rd", "4th"];

    if (options.includes(curriculumYear)) {
        return true;
    } else {
        throw new Error("Must be in ['1st', '2nd', '3rd', '4th']");
    }
};

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

    commonValidationHandler,

    checkAddStudentUniqueness,

    checkAddStudentExistence,
];

/**
 * Allowed fields to update by students
 */
// const allowedFieldsForStudent = ["phone", "name", "gender", "details"];

// const updateStudentValidator = [
//     requiredOne,
//     checkAllow(allowedFieldsForStudent),

//     // Validate the individual fields
//     nameValidator.optional(),
//     genderValidator.optional(),
//     phoneNumberValidator.optional(),
//     detailsValidator.optional(),
// ];

/**
 * The fields that admin are allowed to update.
 */
// const allowedFieldsForAdmin = ["rollNo", "registrationNo", "batch", "session", "curriculumYear"];

// const updateStudentByAdminValidator = [
//     requiredOne,
//     checkAllow(allowedFieldsForAdmin),

//     rollNoValidator.optional().custom(async (rollNo) => {
//         try {
//             const roll = await models.Student.findOne({
//                 where: {
//                     rollNo,
//                 },
//                 attributes: ["rollNo"],
//                 raw: true,
//             });

//             if (roll) {
//                 throw new createHttpError(409, "Already exists");
//             }
//         } catch (err) {
//             if (err.status) console.log(err);
//             throw new Error(err.status ? err.message : "Error checking roll number");
//         }
//     }),

//     registrationNoValidator.optional().custom(async (registrationNo) => {
//         try {
//             const registration = await models.Student.findOne({
//                 where: {
//                     registrationNo,
//                 },
//                 attributes: ["registrationNo"],
//                 raw: true,
//             });

//             if (registration) {
//                 throw new createHttpError(409, "Already exists");
//             }
//         } catch (err) {
//             if (err.status) console.log(err);
//             throw new Error(err.status ? err.message : "Error checking registration number");
//         }
//     }),

//     batchValidator.optional(),
//     sessionValidator.optional(),
//     curriculumYearValidator.optional(),
// ];

export default {
    addStudentValidator,
    // updateStudentValidator,
    // updateStudentByAdminValidator,
};
