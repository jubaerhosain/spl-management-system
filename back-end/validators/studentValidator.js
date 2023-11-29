import joi from "joi";

const Joi = joi.defaults((schema) => {
    return schema.options({
        abortEarly: false,
    });
});

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

import utils from "../utils/utils.js";
import UserRepository from "../repositories/UserRepository.js";
import StudentRepository from "../repositories/StudentRepository.js";

const createStudentSchema = Joi.array().items(
    Joi.object({
        name: Joi.string().trim().custom(validateName).required(),
        email: Joi.string().trim().email().custom(validateEmail).required(),
        rollNo: Joi.string().trim().custom(validateRollNo).required(),
        registrationNo: Joi.string().trim().custom(validateRegistrationNo).required(),
        batch: Joi.string().trim().custom(validateBatch).required(),
        session: Joi.string().trim().custom(validateSession).required(),
        curriculumYear: Joi.string().trim().custom(validateCurriculumYear).required(),
    })
);

const updateStudentSchema = Joi.object({
    name: Joi.string().trim().custom(validateName).optional(),
    gender: Joi.string().trim().custom(validateGender).optional(),
    phone: Joi.string().trim().custom(validatePhoneNumber).optional(),
    details: Joi.string().trim().min(5).max(600).optional(),
});

const updateStudentByAdminSchema = Joi.object({
    studentId: Joi.string().uuid().required(),
    name: Joi.string().trim().custom(validateName).optional(),
    rollNo: Joi.string().trim().custom(validateRollNo).optional(),
    registrationNo: Joi.string().trim().custom(validateRegistrationNo).optional(),
    batch: Joi.string().trim().custom(validateBatch).optional(),
    session: Joi.string().trim().custom(validateSession).optional(),
    curriculumYear: Joi.string().trim().custom(validateCurriculumYear).optional(),
});

function validateCreateStudentDuplicates(students) {
    const error = {};
    const emails = students.map((student) => student.email);
    emails.forEach((email, index) => {
        if (utils.countOccurrences(emails, email) > 1) {
            if (!error[index]) {
                error[index] = {};
            }
            error[index]["email"] = {
                msg: "duplicate email not allowed",
                value: email,
            };
        }
    });

    const rollNos = students.map((student) => student.rollNo);
    rollNos.forEach((rollNo, index) => {
        if (utils.countOccurrences(rollNos, rollNo) > 1) {
            if (!error[index]) {
                error[index] = {};
            }
            error[index]["rollNo"] = {
                msg: "duplicate roll not allowed",
                value: rollNo,
            };
        }
    });

    const registrationNos = students.map((student) => student.registrationNo);
    registrationNos.forEach((registrationNo, index) => {
        if (utils.countOccurrences(registrationNos, registrationNo) > 1) {
            if (!error[index]) {
                error[index] = {};
            }
            error[index]["registrationNo"] = {
                msg: "duplicate registration not allowed",
                value: registrationNo,
            };
        }
    });

    if (Object.keys(error).length === 0) return null;

    return error;
}

/**
 * Checks whether email, rollNo, registrationNo already exists or not.
 * @param {*} students
 * @returns
 */
async function validateCreateStudentExistence(students) {
    const error = {};
    const emails = students.map((student) => student.email);
    const existedEmails = await UserRepository.findAllExistedEmail(emails);
    emails.forEach((email, index) => {
        if (existedEmails.includes(email)) {
            if (!error[index]) {
                error[index] = {};
            }
            error[index]["email"] = {
                msg: "email already exists",
                value: email,
            };
        }
    });

    const rollNos = students.map((student) => student.rollNo);
    const existedRollNos = await StudentRepository.findAllExistedRollNo(rollNos);
    rollNos.forEach((rollNo, index) => {
        if (existedRollNos.includes(rollNo)) {
            if (!error[index]) {
                error[index] = {};
            }
            error[index]["rollNo"] = {
                msg: "rollNo already exists",
                value: rollNo,
            };
        }
    });

    const registrationNos = students.map((student) => student.registrationNo);
    const existedRegistrationNos = await StudentRepository.findAllExistedRegistrationNo(registrationNos);
    registrationNos.forEach((registrationNo, index) => {
        if (existedRegistrationNos.includes(registrationNo)) {
            if (!error[index]) {
                error[index] = {};
            }
            error[index]["registrationNo"] = {
                msg: "registrationNo already exists",
                value: registrationNo,
            };
        }
    });

    if (Object.keys(error).length === 0) return null;

    return error;
}

export default {
    createStudentSchema,
    validateCreateStudentDuplicates,
    validateCreateStudentExistence,
    updateStudentSchema,
    updateStudentByAdminSchema,
};
