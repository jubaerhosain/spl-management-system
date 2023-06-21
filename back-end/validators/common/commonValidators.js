import UserRepository from "../../repositories/UserRepository.js";
import CustomError from "../../utils/CustomError.js";

export const validatePassword = (password) => {
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&.]{8,}$/;
    if (password.length < 8) throw new CustomError("Password must be at least 8 characters");

    let result = regex.test(password);
    if (!result)
        throw new CustomError(
            "Must contain at least one uppercase, lowercase, number and special character"
        );

    return true;
};

export const validateEmail = (email) => {
    const regex = /.+@iit\.du\.ac\.bd$/;

    if (regex.test(email)) {
        return true;
    } else {
        throw new CustomError("Must be end with '@iit.du.ac.bd");
    }
};

export const validatePhoneNumber = (phoneNumber) => {
    const regex = /(^\+8801[0-9]{9}$)|(^01[0-9]{9}$)/;
    const isValid = regex.test(phoneNumber);

    if (isValid) {
        return true;
    } else {
        throw new CustomError("Must be a bangladeshi number");
    }
};


export const checkEmailExistence = async (email) => {
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
