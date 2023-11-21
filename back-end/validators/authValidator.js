import joi from "joi";
import { validatePassword, validateOTP } from "./common/commonValidators.js";

const Joi = joi.defaults((schema) => {
    return schema.options({
        abortEarly: false,
    });
});

const loginFormSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().empty().required(),
    checked: Joi.boolean().optional(),
});

const changePasswordFormSchema = Joi.object({
    oldPassword: Joi.string().trim().required(),
    newPassword: Joi.string().trim().custom(validatePassword).required(),
});

const generateOTPFormSchema = Joi.object({
    email: Joi.string().trim().email().required(),
});

const verifyOTPFormSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    otp: Joi.string().trim().custom(validateOTP).required(),
});

const resetPasswordFormSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    otp: Joi.string().trim().custom(validateOTP).required(),
    password: Joi.string().trim().custom(validatePassword).required(),
});

export default {
    loginFormSchema,
    changePasswordFormSchema,
    generateOTPFormSchema,
    verifyOTPFormSchema,
    resetPasswordFormSchema,
};
