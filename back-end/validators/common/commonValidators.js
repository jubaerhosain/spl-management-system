import UserRepository from "../../repositories/UserRepository.js";
import CustomError from "../../utils/CustomError.js";

export const validatePassword = (password, helper) => {
    if (password.length < 8) return helper.message("Password length must be at least 8 character");
    if (password.length > 30) return helper.message("Password length must be less than 30 character");

    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&.]{8,}$/;

    if (!regex.test(password))
        return helper.message("Must contain at least one uppercase, lowercase, number and special character");

    return true;
};

export const validateName = (name) => {
    let regex = /^[ \.a-zA-Z]{3,}$/;
    if (name.length < 3) throw new CustomError("Name must be at least 3 characters");

    let result = regex.test(name);
    if (!result) {
        throw new CustomError("Only characters, spaces and dots are allowed");
    }
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
};

export const validateGender = (gender) => {
    const options = ["male", "female", "other"];

    if (options.includes(gender)) {
        return true;
    } else {
        throw new Error("Must be in ['male', 'female', 'other']");
    }
};

export const validateRollNo = (rollNo) => {
    const regex = /^[0-9]{4}$/;
    const isValid = regex.test(rollNo);

    if (isValid) {
        return true;
    } else {
        throw new Error("Must be a 4 digit number");
    }
};

export const validateRegistrationNo = (registrationNo) => {
    const regex = /^[0-9]{10}$/;
    const isValid = regex.test(registrationNo);

    if (isValid) {
        return true;
    } else {
        throw new Error("Must be a 10 digit number");
    }
};

export const validateBatch = (batch) => {
    const regex = /^[0-9]{2}$/;
    const isValid = regex.test(batch);

    if (isValid) {
        return true;
    } else {
        throw new Error("Must be a 2 digit number");
    }
};

export const validateSession = (session) => {
    const regex = /^[0-9]{4}-[0-9]{2}$/;
    const isValid = regex.test(session);

    if (isValid) {
        return true;
    } else {
        throw new Error("Must be in following format: '2018-19'");
    }
};

export const validateCurriculumYear = (curriculumYear) => {
    const options = ["1st", "2nd", "3rd", "4th"];

    if (options.includes(curriculumYear)) {
        return true;
    } else {
        throw new Error("Must be in ['1st', '2nd', '3rd', '4th']");
    }
};

export const validateSPLName = (splName) => {
    const options = ["spl1", "spl2", "spl3"];

    if (options.includes(splName)) {
        return true;
    } else {
        throw new Error("Must be in ['spl1', 'spl2', 'spl3'");
    }
};

export const validateAcademicYear = (academicYear) => {
    const regex = /^[0-9]{4}-[0-9]{2}$/;
    const isValid = regex.test(academicYear);

    if (isValid) {
        return true;
    } else {
        throw new Error("Must be in following format: '2018-19'");
    }
};
