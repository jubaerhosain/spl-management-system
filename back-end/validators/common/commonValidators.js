import UserRepository from "../../repositories/UserRepository.js";
import CustomError from "../../utils/CustomError.js";

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

export const validateEmail = (email) => {
    return false;
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
