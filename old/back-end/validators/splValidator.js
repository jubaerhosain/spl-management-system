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

const addCommitteeHeadSchema = Joi.object({
    email: Joi.string().trim().email().custom(validateEmail).required(),
});

const addSPLManagerSchema = Joi.object({
    email: Joi.string().trim().email().custom(validateEmail).required(),
});

const addCommitteeMemberSchema = Joi.array().items(
    Joi.object({
        email: Joi.string().trim().email().custom(validateEmail).required(),
    })
);

function validateMemberEmailDuplicates(members) {
    const error = {};
    const emails = members.map((member) => member.email);
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

export default {
    createSPLSchema,
    updateSPLSchema,
    addCommitteeHeadSchema,
    addSPLManagerSchema,
    addCommitteeMemberSchema,
    validateMemberEmailDuplicates,
};
