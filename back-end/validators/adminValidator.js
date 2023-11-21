import joi from "joi";
const Joi = joi.defaults((schema) => {
    return schema.options({
        abortEarly: false,
    });
});

import { validateName, validateEmail } from "../validators/common/commonValidators.js";

const createAdminSchema = Joi.object({
    name: Joi.string().trim().custom(validateName).required(),
    email: Joi.string().trim().email().custom(validateEmail).required(),
});

const updateAdminSchema = Joi.object({
    name: Joi.string().trim().custom(validateName).required(),
});

export default { createAdminSchema, updateAdminSchema };
