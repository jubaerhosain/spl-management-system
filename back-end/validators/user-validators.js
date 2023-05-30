import { body_param, body } from "./custom-validator.js";

/**
 * Custom function to check if email ends with '@iit.du.ac.bd' or not
 * @param {*} email
 * @returns true/false
 */
function isIITEmail(email) {
    const regex = /.+@iit\.du\.ac\.bd$/;

    if (regex.test(email)) {
        return true;
    } else {
        return false;
    }
}

const emailValidator = body_param("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Must be at most 50 characters")
    .bail()
    .custom((email) => {
        if (isIITEmail(email)) return true;
        throw new Error("Must be end with '@iit.du.ac.bd'");
    });

const nameValidator = body("name")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Must be between 3 to 50 characters")
    .bail()
    .matches(/^[ \.a-zA-Z]{3,}$/)
    .withMessage("Only characters, spaces and dots are allowed");

const genderValidator = body("gender")
    .trim()
    .isIn(["male", "female", "other"])
    .withMessage("Must be in ['male', 'female', 'other']");

const phoneNumberValidator = body("phone")
    .trim()
    .matches(/^\+880[0-9]{10}$/)
    .withMessage("Must be a bangladeshi number including '+880' at start");

const detailsValidator = body("details")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Must be between 10 to 2000 characters");

export {
    emailValidator,
    nameValidator,
    genderValidator,
    phoneNumberValidator,
    detailsValidator,
    isIITEmail,
};
