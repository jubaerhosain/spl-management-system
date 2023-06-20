import UserRepository from "../../repositories/UserRepository.js";
import CustomError from "../../utils/CustomError.js";

/**
 * Throws error if not math with regex
 * @param {*} password 
 * @returns 
 */
export const validatePassword = (password) => {
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&.]{8,}$/;
    if (password.length < 8) throw new Error("Password must be at least 8 characters");

    let result = regex.test(password);
    if (!result)
        throw new Error(
            "Must contain at least one uppercase, lowercase, number and special character"
        );

    return true;
};

/**
 * Check if the email is IIT email or not.
 * @param {} email
 * @returns
 */
export const validateEmail = (email) => {
    const regex = /.+@iit\.du\.ac\.bd$/;

    if (regex.test(email)) {
        return true;
    } else {
        return false;
    }
};

/**
 * Throws error if email does not exist
 * @param {*} email
 * @returns
 */
export async function checkEmailExistence(email) {
    try {
        const exists = await UserRepository.isEmailExists(email);
        if (!exists) {
            throw new CustomError("Email does not exist", 400);
        }
        return true;
    } catch (err) {
        console.log(err);
        if (err.status) throw new CustomError(err.message);
        else throw new CustomError("And error occurred while checking email");
    }
}
