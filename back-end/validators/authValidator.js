import { body } from "express-validator";
import Joi from "joi";
import { commonValidationHandler } from "./common/commonValidationHandler.js";
import { validatePassword, checkEmailExistence } from "./common/commonValidators.js";
import JoiUtils from "../utils/JoiUtils.js";

const loginFormSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(8).max(30).required(),
});

const changePasswordFormSchema = Joi.object({
    oldPassword: Joi.string().trim().required(),
    newPassword: Joi.string().trim().min(8).max(30).required(),
});

function validateLoginForm(data) {
    try {
        const { error } = loginFormSchema.validate(data, { abortEarly: false });
        if (error) {
            const transformedError = JoiUtils.transformError(error);
            return transformedError;
        }
    } catch (error) {
        console.log(error);
    }
    return null;
}

function validateChangePasswordForm(data) {
    try {
        const { error } = changePasswordFormSchema.validate(data, { abortEarly: false });
        if (error) {
            const transformedError = JoiUtils.transformError(error);
            return transformedError;
        }
    } catch (error) {
        console.log(error);
    }
    return null;
}

const loginForm = [
    body("email").trim().notEmpty().withMessage("Email must be provided").isEmail().withMessage("Must be a valid email"),
    body("password").trim().notEmpty().withMessage("Password must be provided"),
    commonValidationHandler,
];

const changePasswordForm = [
    body("oldPassword").trim().notEmpty().withMessage("Password must be provided"),
    body("newPassword")
        .trim()
        .notEmpty()
        .withMessage("Password must be provided")
        .bail()
        .custom((newPassword) => {
            return validatePassword(newPassword);
        }),
    commonValidationHandler,
];

const generateOTPForm = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email must be provided")
        .isEmail()
        .withMessage("Must be a valid email")
        .bail()
        .custom(async (email) => {
            await checkEmailExistence(email);
        }),
    commonValidationHandler,
];

const verifyOTPForm = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email must be provided")
        .isEmail()
        .withMessage("Must be a valid email")
        .bail()
        .custom(async (email) => {
            await checkEmailExistence(email);
        }),
    body("otp").trim().notEmpty().withMessage("OTP must be provided"),
    commonValidationHandler,
];

const resetPasswordForm = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email must be provided")
        .isEmail()
        .withMessage("Must be a valid email")
        .bail()
        .custom(async (email) => {
            await checkEmailExistence(email);
        }),
    body("otp").trim().notEmpty().withMessage("OTP must be provided"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password must be provided")
        .bail()
        .custom((newPassword) => {
            return validatePassword(newPassword);
        }),
    commonValidationHandler,
];

export default { validateLoginForm, loginForm, changePasswordForm, generateOTPForm, verifyOTPForm, resetPasswordForm };
