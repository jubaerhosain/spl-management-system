import { body } from "express-validator";
import { commonValidationHandler } from "./common/commonValidationHandler.js";
import CustomError from "../utils/CustomError.js";
import StudentRepository from "../repositories/StudentRepository.js";

import {
    validateEmail,
    validateName,
    validateRollNo,
    validateRegistrationNo,
    validateBatch,
    validateSession,
    validateGender,
    validatePhoneNumber,
    validateCurriculumYear,
} from "./common/commonValidators.js";

import {
    checkAddStudentUniqueness,
    checkAddStudentExistence,
    requiredAtLeastOneField,
    isFieldAllowed,
} from "./common/validationMiddlewares.js";

const allowedFieldsForStudent = ["phone", "name", "gender", "details"];
const allowedFieldsForAdmin = ["rollNo", "registrationNo", "batch", "session", "curriculumYear"];

const validateCreateStudentAccount = [
    body("students")
        .isArray()
        .withMessage("Must be an array")
        .bail()
        .isLength({ min: 1 })
        .withMessage("Cannot be empty array"),

    body("students.*.name")
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .custom((name) => {
            return validateName(name);
        }),

    body("students.*.email")
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Invalid email format")
        .bail()
        .custom((email) => {
            return validateEmail(email);
        }),

    body("students.*.rollNo")
        .trim()
        .notEmpty()
        .withMessage("rollNo cannot be empty")
        .custom((rollNo) => {
            return validateRollNo(rollNo);
        }),

    body("students.*.registrationNo")
        .trim()
        .notEmpty()
        .withMessage("registrationNo cannot be empty")
        .custom((registrationNo) => {
            return validateRegistrationNo(registrationNo);
        }),

    body("students.*.batch")
        .trim()
        .notEmpty()
        .withMessage("batch cannot be empty")
        .custom((batch) => {
            return validateBatch(batch);
        }),

    body("students.*.session")
        .trim()
        .notEmpty()
        .withMessage("session cannot be empty")
        .custom((session) => {
            return validateSession(session);
        }),

    body("students.*.curriculumYear")
        .trim()
        .notEmpty()
        .withMessage("curriculumYear cannot be empty")
        .custom((curriculumYear) => {
            return validateCurriculumYear(curriculumYear);
        }),

    commonValidationHandler,

    checkAddStudentUniqueness,

    checkAddStudentExistence,
];

const validateUpdateStudentAccount = [
    requiredAtLeastOneField,
    isFieldAllowed(allowedFieldsForStudent),

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

const validateUpdateStudentAccountByAdmin = [
    requiredAtLeastOneField,
    isFieldAllowed(allowedFieldsForAdmin),

    body("rollNo")
        .trim()
        .custom((rollNo) => {
            return validateRollNo(rollNo);
        })
        .bail()
        .custom(async (rollNo) => {
            try {
                const exist = await StudentRepository.isRollNoExist(rollNo);
                if (exist) throw new CustomError("rollNo already exists", 400);
            } catch (err) {
                if (err.status) throw new CustomError(err.message);
                else {
                    console.log(err);
                    throw new CustomError("An error occurred while checking rollNo");
                }
            }
        })
        .optional(),

    body("registrationNo")
        .trim()
        .custom((registrationNo) => {
            return validateRegistrationNo(registrationNo);
        })
        .bail()
        .custom(async (registrationNo) => {
            try {
                const exist = await StudentRepository.isRegistrationNoExist(registrationNo);
                if (exist) throw new CustomError("registrationNo already exists", 400);
            } catch (err) {
                if (err.status) throw new CustomError(err.message);
                else {
                    console.log(err);
                    throw new CustomError("An error occurred while checking registrationNo");
                }
            }
        })
        .optional(),

    body("batch")
        .trim()
        .custom((batch) => {
            return validateBatch(batch);
        })
        .optional(),

    body("session")
        .trim()
        .custom((session) => {
            return validateSession(session);
        })
        .optional(),

    body("curriculumYear")
        .trim()
        .custom((curriculumYear) => {
            return validateCurriculumYear(curriculumYear);
        })
        .optional(),

    commonValidationHandler,
];

export default {
    validateCreateStudentAccount,
    validateUpdateStudentAccount,
    validateUpdateStudentAccountByAdmin,
};
