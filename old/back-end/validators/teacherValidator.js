import joi from "joi";
import utils from "../utils/utils.js";
import UserRepository from "../repositories/UserRepository.js";

const Joi = joi.defaults((schema) => {
    return schema.options({
        abortEarly: false,
    });
});

import {
    validateEmail,
    validateName,
    validatePhoneNumber,
    validateGender,
    validateDesignation,
} from "./common/commonValidators.js";

const createTeacherSchema = Joi.array().items(
    Joi.object({
        name: Joi.string().trim().custom(validateName).required(),
        email: Joi.string().trim().email().custom(validateEmail).required(),
        designation: Joi.string().trim().custom(validateDesignation).required(),
    })
);

const updateTeacherSchema = Joi.object({
    name: Joi.string().trim().custom(validateName).optional(),
    gender: Joi.string().trim().custom(validateGender).optional(),
    phone: Joi.string().trim().custom(validatePhoneNumber).optional(),
    details: Joi.string().trim().min(5).max(600).optional(),
    designation: Joi.string().trim().custom(validateDesignation).optional(),
    available: Joi.boolean().optional(),
});

function validateCreateTeacherDuplicates(teachers) {
    const error = {};
    const emails = teachers.map((teacher) => teacher.email);
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

    if (Object.keys(error).length === 0) return null;

    return error;
}

/**
 * Checks whether emails are already exists or not.
 * @param {*} teachers
 * @returns
 */
async function validateCreateTeacherExistence(teachers) {
    const error = {};
    const emails = teachers.map((teacher) => teacher.email);
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

    if (Object.keys(error).length === 0) return null;

    return error;
}

export default {
    createTeacherSchema,
    validateCreateTeacherDuplicates,
    validateCreateTeacherExistence,
    updateTeacherSchema,
};
