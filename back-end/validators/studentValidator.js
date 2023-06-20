import createError from "http-errors";
import { body, body_param, body_param_query } from "./custom-validator.js";
import { isUnique } from "../utilities/common-utilities.js";

// import validators
import {
    nameValidator,
    phoneNumberValidator,
    genderValidator,
    detailsValidator,
} from "./userValidators.js";

import { requiredOne, checkAllow } from "./common-validators.js";
import createHttpError from "http-errors";

/**
 * body, params, query
 */
const studentIdValidator = body_param_query("studentId")
    .trim()
    .notEmpty()
    .withMessage("Must be provided");

const rollNoValidator = body("rollNo")
    .trim()
    .matches(/^BSSE-[0-9]{4}$/)
    .withMessage("Must be in following format: '1255'");

const registrationNoValidator = body("registrationNo")
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage("Must be a 10 digit number");

const batchValidator = body("batch")
    .trim()
    .matches(/^[0-9]{2}$/)
    .withMessage("Must be a 2 digit number");

const sessionValidator = body("session")
    .trim()
    .matches(/^[0-9]{4}-[0-9]{2}$/)
    .withMessage("Must be in following format: '2018-19'");

const curriculumYearValidator = body("curriculumYear")
    .trim()
    .isIn(["1st", "2nd", "3rd", "4th"])
    .withMessage("Must be in ['1st', '2nd', '3rd', '4th']");

const addStudentValidator = [
    // validate mandatory fields
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
        .isLength({ max: 50 })
        .withMessage("Must be at most 50 characters")
        .matches(/.+@iit\.du\.ac\.bd$/)
        .withMessage("Must end with @iit.du.ac.bd"),
    body("students.*.rollNo")
        .trim()
        .matches(/^[0-9]{4}$/)
        .withMessage("Must be a 4 digit number"),
    body("students.*.registrationNo")
        .trim()
        .matches(/^[0-9]{10}$/)
        .withMessage("Must be a 10 digit number"),
    body("students.*.batch")
        .trim()
        .matches(/^[0-9]{2}$/)
        .withMessage("Must be a 2 digit number"),
    body("students.*.session")
        .trim()
        .matches(/^[0-9]{4}-[0-9]{2}$/)
        .withMessage("Must be in following format: '2018-19'"),
    body("students.*.curriculumYear")
        .trim()
        .isIn(["1st", "2nd", "3rd", "4th"])
        .withMessage("Must be in ['1st', '2nd', '3rd', '4th']"),
];

/**
 * Allowed fields to update by students
 */
const allowedFieldsForStudent = ["phone", "name", "gender", "details"];

const updateStudentValidator = [
    requiredOne,
    checkAllow(allowedFieldsForStudent),

    // Validate the individual fields
    nameValidator.optional(),
    genderValidator.optional(),
    phoneNumberValidator.optional(),
    detailsValidator.optional(),
];

/**
 * The fields that admin are allowed to update.
 */
const allowedFieldsForAdmin = ["rollNo", "registrationNo", "batch", "session", "curriculumYear"];

const updateStudentByAdminValidator = [
    requiredOne,
    checkAllow(allowedFieldsForAdmin),

    rollNoValidator.optional().custom(async (rollNo) => {
        try {
            const roll = await models.Student.findOne({
                where: {
                    rollNo,
                },
                attributes: ["rollNo"],
                raw: true,
            });

            if (roll) {
                throw new createHttpError(409, "Already exists");
            }
        } catch (err) {
            if (err.status) console.log(err);
            throw new Error(err.status ? err.message : "Error checking roll number");
        }
    }),

    registrationNoValidator.optional().custom(async (registrationNo) => {
        try {
            const registration = await models.Student.findOne({
                where: {
                    registrationNo,
                },
                attributes: ["registrationNo"],
                raw: true,
            });

            if (registration) {
                throw new createHttpError(409, "Already exists");
            }
        } catch (err) {
            if (err.status) console.log(err);
            throw new Error(err.status ? err.message : "Error checking registration number");
        }
    }),

    batchValidator.optional(),
    sessionValidator.optional(),
    curriculumYearValidator.optional(),
];

export {
    studentIdValidator,
    addStudentValidator,
    updateStudentValidator,
    updateStudentByAdminValidator,
};
