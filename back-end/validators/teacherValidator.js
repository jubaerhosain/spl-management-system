import joi from "joi";
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

export default { createTeacherSchema, updateTeacherSchema };
