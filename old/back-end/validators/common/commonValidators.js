export const validatePassword = (password, helper) => {
    if (password.length < 8) return helper.message("password length must be at least 8 character");
    if (password.length > 30) return helper.message("password length must be less than 30 character");

    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&.]{8,}$/;
    if (!regex.test(password))
        return helper.message("password must contain at least one uppercase, lowercase, number and special character");

    return true;
};

export const validateName = (name, helper) => {
    if (name.length < 3) return helper.message("name must be at least 3 character long");

    let regex = /^[\d \.a-zA-Z]{3,}$/;
    if (!regex.test(name)) {
        return helper.message("Only characters, spaces and dots are allowed");
    }
    return true;
};

export const validateEmail = (email, helper) => {
    const regex = /.+@iit\.du\.ac\.bd$/;

    if (!regex.test(email)) {
        return helper.message("email must be end with '@iit.du.ac.bd");
    }

    return true;
};

export const validatePhoneNumber = (phone, helper) => {
    const regex = /(^\+8801[0-9]{9}$)|(^01[0-9]{9}$)/;

    if (!regex.test(phone)) {
        return helper.message("phone must be a bangladeshi number");
    }

    return true;
};

export const validateGender = (gender, helper) => {
    const options = ["male", "female", "other"];

    if (!options.includes(gender)) {
        return helper.message("gender must be in ['male', 'female', 'other']");
    }

    return true;
};

export const validateRollNo = (rollNo, helper) => {
    const regex = /^[0-9]{4}$/;
    const isValid = regex.test(rollNo);

    if (!regex.test(rollNo)) {
        return helper.message("rollNo must be a 4 digit number");
    }

    return true;
};

export const validateRegistrationNo = (registrationNo, helper) => {
    const regex = /^[0-9]{10}$/;

    if (!regex.test(registrationNo)) {
        return helper.message("registrationNo must be a 10 digit number");
    }

    return true;
};

export const validateBatch = (batch, helper) => {
    const regex = /^[0-9]{2}$/;

    if (!regex.test(batch)) {
        return helper.message("batch must be a 2 digit number");
    }

    return true;
};

export const validateSession = (session, helper) => {
    const regex = /^[0-9]{4}-[0-9]{2}$/;

    if (!regex.test(session)) {
        return helper.message("session must be in the following format: '2018-19'");
    }

    return true;
};

export const validateCurriculumYear = (curriculumYear, helper) => {
    const options = ["1st", "2nd", "3rd", "4th"];

    if (!options.includes(curriculumYear)) {
        return helper.message("curriculumYear must be in ['1st', '2nd', '3rd', '4th']");
    }

    return true;
};

export const validateSPLName = (splName, helper) => {
    const options = ["spl1", "spl2", "spl3"];

    if (!options.includes(splName)) {
        return helper.message("splName must be in ['spl1', 'spl2', 'spl3']");
    }

    return true;
};

export const validateAcademicYear = (academicYear, helper) => {
    const regex = /^[0-9]{4}$/;

    if (!regex.test(academicYear)) {
        return helper.message("academicYear must be in following format: '2018'");
    }

    return true;
};

export const validateOTP = (otp, helper) => {
    const regex = /^\d{6}$/;
    if (!regex.test(otp)) {
        return helper.message("otp must be a 6-digit number");
    }

    return true;
};

export const validateDesignation = (designation, helper) => {
    const options = ["Professor", "Associate Professor", "Assistant Professor", "Lecturer"];

    if (!options.includes(designation)) {
        return helper.message("invalid designation");
    }

    return true;
};

export const validateUserType = (userType, helper) => {
    const options = ["admin", "student", "teacher"];

    if (!options.includes(userType)) {
        return helper.message("User type must be in ['admin', 'student', 'teacher']");
    }

    return true;
};
