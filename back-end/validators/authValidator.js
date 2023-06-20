import { body } from "express-validator";
import { commonValidationHandler } from "./common/commonValidationHandler.js";
import { validatePassword } from "./common/commonValidators.js";

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

export default { loginForm, changePasswordForm };
