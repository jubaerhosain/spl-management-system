import SPLRepository from "../repositories/SPLRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import CustomError from "../utils/CustomError.js";
import joi from "joi";
const Joi = joi.defaults((schema) => {
    return schema.options({
        abortEarly: false,
    });
});

import { validateSPLName, validateAcademicYear, validateEmail } from "./common/commonValidators.js";

const createSPLSchema = Joi.object({
    splName: Joi.string().trim().custom(validateSPLName).required(),
    academicYear: Joi.string().trim().custom(validateAcademicYear).required(),
    head: Joi.string().trim().email().custom(validateEmail).required(),
    manager: Joi.string().trim().email().custom(validateEmail).required(),
    member1: Joi.string().trim().email().custom(validateEmail).required(),
    member2: Joi.string().trim().email().custom(validateEmail).required(),
    member3: Joi.string().trim().email().custom(validateEmail).required(),
    member4: Joi.string().trim().email().custom(validateEmail).optional(),
    member5: Joi.string().trim().email().custom(validateEmail).optional(),
    member6: Joi.string().trim().email().custom(validateEmail).optional(),
});

const updateSPLSchema = Joi.object({
    splName: Joi.string().trim().custom(validateSPLName).required(),
    academicYear: Joi.string().trim().custom(validateAcademicYear).required(),
    committeeHead: Joi.string().trim().email().custom(validateEmail).required(),
    splManager: Joi.string().trim().email().custom(validateEmail).required(),
});

const addCommitteeHeadSchema = Joi.object({});
const addSPLManagerSchema = Joi.object({});
const addCommitteeMemberSchema = Joi.array().items(
    Joi.object({
        email: Joi.string().trim().email().custom(validateEmail).required(),
    })
);

export default {
    createSPLSchema,
    updateSPLSchema,
};
