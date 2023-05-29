import { body_param, body } from "./custom-validator.js";
import { makeUnique } from "../utilities/common-utilities.js";

// import validators
import { teacherIdValidator } from "./teacher-validators.js";
import { studentIdValidator } from "./student-validators.js";

// spl attributes validators
const splIdValidator = body_param("splId").trim().isInt().withMessage("Must be an integer");

const splNameValidator = body_param("splName")
    .trim()
    .isIn(["spl1", "spl2", "spl3"])
    .withMessage("Must be in ['spl1', 'spl2', 'spl3']");

const academicYearValidator = body_param("academicYear")
    .trim()
    .matches(/^[0-9]{4}$/)
    .withMessage("Must be a 4 digit integer");

const createSPLValidator = [splNameValidator, academicYearValidator];
const addSPLManagerValidator = [splIdValidator, teacherIdValidator];
const removeSPLManagerValidator = [splIdValidator];

const assignStudentValidator = splNameValidator;

const removeStudentValidator = [splIdValidator, studentIdValidator];

export {
    splIdValidator,
    splNameValidator,
    createSPLValidator,
    addSPLManagerValidator,
    removeSPLManagerValidator,
    assignStudentValidator,
    removeStudentValidator,
};
