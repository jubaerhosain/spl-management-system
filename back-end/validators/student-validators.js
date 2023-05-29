import createError from "http-errors";
import { body, body_param } from "./custom-validator.js";
import { isUnique } from "../utilities/common-utilities.js";

// import validators
import {
    nameValidator,
    phoneNumberValidator,
    genderValidator,
    detailsValidator,
} from "./user-validators.js";
import { requiredOne, checkAllow } from "./common-validators.js";

// import database checkers
import { studentIdExistence } from "./db-checkers/student-db-checkers.js";

/**
 * Validate studentId from body or param
 */
const studentIdValidator = body_param("studentId")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Must be provided")
    .bail()
    .isInt()
    .withMessage("Must be an integer");

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
        .bail()
        .isLength({ max: 50 })
        .withMessage("Must be at most 50 characters")
        .bail()
        .matches(/.+@iit\.du\.ac\.bd$/)
        .withMessage("Must end with @iit.du.ac.bd"),
    body("students.*.rollNo")
        .trim()
        .matches(/^[0-9]{4}$/)
        .withMessage("Must be in following format: '1255'"),
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
    phoneNumberValidator.optional(),
    nameValidator.optional(),
    genderValidator.optional(),
    detailsValidator.optional(),
];

/**
 * The fields that admin are allowed to update.
 */
const allowedFieldsForAdmin = ["rollNo", "registrationNo", "batch", "session", "curriculumYear"];

const updateStudentByAdminValidator = [
    requiredOne,
    checkAllow(allowedFieldsForAdmin),

    // do it in previous validator
    // if it fails then roll and reg db check won't happen, increases performance
    studentIdExistence,

    rollNoValidator.optional(),
    registrationNoValidator.optional(),
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
