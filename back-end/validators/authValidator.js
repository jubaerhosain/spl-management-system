import { body } from "express-validator";
import { commonValidationHandler } from "./common/commonValidationHandler.js";
import { validatePassword, checkEmailExistence } from "./common/commonValidators.js";
import UserRepository from "../repositories/UserRepository.js";
import CustomError from "../utils/CustomError.js";

const loginForm = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email must be provided")
        .isEmail()
        .withMessage("Must be a valid email"),
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

export default { loginForm, changePasswordForm, generateOTPForm, verifyOTPForm, resetPasswordForm };
