import { body } from "express-validator";
import { commonValidationHandler } from "./common/commonValidationHandler.js";
import { validatePassword } from "./common/commonValidators.js";
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
            try {
                const exists = await UserRepository.isEmailExists(email);
                if (!exists) {
                    throw new CustomError("Email does not exist", 400);
                }
                return true;
            } catch (err) {
                console.log(err);
                if (err.status) throw new CustomError(err.message);
                else throw new CustomError("And error occurred while verifying email");
            }
        }),
    commonValidationHandler,
];

export default { loginForm, changePasswordForm, generateOTPForm };
