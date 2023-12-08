import joi from "joi";
const Joi = joi.defaults((schema) => {
    return schema.options({
        abortEarly: false,
    });
});

import utils from "../utils/utils.js";
import { validateSPLName, validateAcademicYear, validateEmail } from "./common/commonValidators.js";

const createSPLSchema = Joi.object({
    splName: Joi.string().trim().custom(validateSPLName).required(),
    academicYear: Joi.string().trim().custom(validateAcademicYear).required(),
});

const updateSPLSchema = Joi.object({
    splName: Joi.string().trim().custom(validateSPLName).optional(),
    academicYear: Joi.string().trim().custom(validateAcademicYear).optional(),
});

export default {
    createSPLSchema,
    updateSPLSchema,
};
