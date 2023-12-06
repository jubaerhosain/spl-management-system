import { GenericResponse } from "../../utils/responseUtils.js";
import UserRepository from "../../repositories/UserRepository.js";
import StudentRepository from "../../repositories/StudentRepository.js";
import commonUtils from "../../utils/commonUtils.js";

/**
 * Check if at least one field is provided or not in req.body
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export function requiredAtLeastOneField(req, res, next) {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json(
            GenericResponse.error("At least one field must be provided", GenericResponse.BAD_REQUEST)
        );
    } else {
        next();
    }
}

/**
 * Check if provided fields in req.body are allowed or not
 * @param {Array} allowedFields
 * @returns Middleware
 */
export function isFieldAllowed(allowedFields) {
    return async function (req, res, next) {
        const providedFields = Object.keys(req.body);
        const invalidFields = providedFields.filter((field) => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
            req.res
                .status(400)
                .json(
                    GenericResponse.error(
                        "Following fields are not allowed",
                        GenericResponse.BAD_REQUEST,
                        invalidFields
                    )
                );
        } else {
            next();
        }
    };
}

/**
 * Checks uniqueness of email, rollNo and registrationNo
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function checkAddStudentUniqueness(req, res, next) {
    try {
        const { students } = req.body;

        if (!commonUtils.isUnique(students.map((student) => student.email))) {
            res.status(400).json(
                GenericResponse.error("Duplicate emails are not allowed", GenericResponse.BAD_REQUEST)
            );
            return;
        }

        if (!commonUtils.isUnique(students.map((student) => student.rollNo))) {
            res.status(400).json(
                GenericResponse.error("Duplicate roll numbers are not allowed", GenericResponse.BAD_REQUEST)
            );
            return;
        }

        if (!commonUtils.isUnique(students.map((student) => student.registrationNo))) {
            res.status(400).json(
                GenericResponse.error(
                    "Duplicate registration numbers are not allowed",
                    GenericResponse.BAD_REQUEST
                )
            );
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
    }
}

/**
 * Check existence of students email, rollNo and registrationNo
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function checkAddStudentExistence(req, res, next) {
    try {
        const { students } = req.body;

        const errors = [];

        const emails = students.map((student) => student.email);
        const existedEmails = await UserRepository.findExistedEmails(emails);
        if (existedEmails) {
            errors.push({
                message: "Following emails are already exists",
                data: existedEmails,
            });
        }

        const rollNumbers = students.map((student) => student.rollNo);
        const existedRolls = await StudentRepository.findExistedRollNumbers(rollNumbers);
        if (existedRolls) {
            errors.push({
                message: "Following roll numbers are already exists",
                data: existedRolls,
            });
        }

        const regNumbers = students.map((student) => student.registrationNo);
        const existedRegs = await StudentRepository.findExistedRegistrationNumbers(regNumbers);
        if (existedRegs) {
            errors.push({
                message: "Following registration numbers are already exists.",
                data: existedRegs,
            });
        }

        if (errors.length > 0) {
            res.status(400).json(
                GenericResponse.error("Following data are already exists", GenericResponse.ARRAY_DATA, errors)
            );
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
    }
}

export async function checkAddTeacherUniqueness(req, res, next) {
    try {
        const { teachers } = req.body;

        if (!commonUtils.isUnique(teachers.map((teacher) => teacher.email))) {
            res.status(400).json(
                GenericResponse.error("Duplicate emails are not allowed", GenericResponse.BAD_REQUEST)
            );
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
    }
}

export async function checkAddTeacherExistence(req, res, next) {
    try {
        const { teachers } = req.body;

        const errors = [];

        const emails = teachers.map((teacher) => teacher.email);
        const existedEmails = await UserRepository.findExistedEmails(emails);
        if (existedEmails) {
            errors.push({
                message: "Following emails are already exists",
                data: existedEmails,
            });
        }

        if (errors.length > 0) {
            res.status(400).json(
                GenericResponse.error("Following data are already exists", GenericResponse.ARRAY_DATA, errors)
            );
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
    }
}
