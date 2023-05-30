import { body_param, body } from "./custom-validator.js";
import { makeUnique } from "../utilities/common-utilities.js";

const splNameValidator = body_param("splName")
    .trim()
    .isIn(["spl1", "spl2", "spl3"])
    .withMessage("Must be in ['spl1', 'spl2', 'spl3']");

const academicYearValidator = body_param("academicYear")
    .trim()
    .matches(/^[0-9]{4}$/)
    .withMessage("Must be a 4 digit integer");

const createSPLValidator = [splNameValidator, academicYearValidator];

const addSPLManagerValidator = [];
const removeSPLManagerValidator = [];

const assignStudentValidator = splNameValidator;

const removeStudentValidator = [];

export {
    splNameValidator,
    createSPLValidator,
    addSPLManagerValidator,
    removeSPLManagerValidator,
    assignStudentValidator,
    removeStudentValidator,
};
