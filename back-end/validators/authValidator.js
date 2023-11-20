import Joi from "joi";
import { validatePassword } from "./common/commonValidators.js";

const loginFormSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(8).max(30).required(),
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
    otp: Joi.string()
        .regex(/^\d{6}$/)
        .required()
        .messages({
            "string.pattern.base": "OTP must be a 6-digit number",
            "any.required": "OTP is required",
        }),
});

const resetPasswordFormSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    otp: Joi.string()
        .regex(/^\d{6}$/)
        .required()
        .messages({
            "string.pattern.base": "OTP must be a 6-digit number",
            "any.required": "OTP is required",
        }),
    password: Joi.string().trim().min(8).max(30).required(),
});

export default {
    loginFormSchema,
    changePasswordFormSchema,
    generateOTPFormSchema,
    verifyOTPFormSchema,
    resetPasswordFormSchema,
};
