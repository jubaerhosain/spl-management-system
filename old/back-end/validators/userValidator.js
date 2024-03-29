import joi from "joi";
const Joi = joi.defaults((schema) => {
    return schema.options({
        abortEarly: false,
    });
});

import { validateName, validateEmail, validateUserType } from "./common/commonValidators.js";

const createUserSchema = Joi.object({
    name: Joi.string().trim().custom(validateName).required(),
    email: Joi.string().trim().email().custom(validateEmail).required(),
    userType: Joi.string().trim().custom(validateUserType).required(),
});

const updateUserSchema = Joi.object({
    name: Joi.string().trim().custom(validateName).required(),
});

export default { createUserSchema, updateUserSchema };
