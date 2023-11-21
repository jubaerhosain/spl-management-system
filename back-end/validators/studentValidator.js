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
    name: Joi.string().trim().custom(validateName).optional(),
    rollNo: Joi.string().trim().custom(validateRollNo).optional(),
    registrationNo: Joi.string().trim().custom(validateRegistrationNo).optional(),
    batch: Joi.string().trim().custom(validateBatch).optional(),
    session: Joi.string().trim().custom(validateSession).optional(),
    curriculumYear: Joi.string().trim().custom(validateCurriculumYear).optional(),
});

export default {
    addStudentSchema,
    updateStudentSchema,
    updateStudentByAdminSchema,
};
