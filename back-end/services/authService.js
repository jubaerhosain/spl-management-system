import jwtUtils from "../utils/jwtUtils.js";
import passwordUtils from "../utils/passwordUtils.js";
import UserRepository from "../repositories/UserRepository.js";
import OTPRepository from "../repositories/OTPRepository.js";
import CustomError from "../utils/CustomError.js";

/**
 * Returns jwt if login successful otherwise return null
 * @param {*} email
 * @param {*} password
 * @returns {Promise<Object>} jwt
 */
async function login(email, password) {
    const hashedPassword = await UserRepository.findPasswordByEmail(email);

    if (!hashedPassword) {
        throw new CustomError("Email not found", 400);
    }

    const matches = await passwordUtils.verifyPassword(password, hashedPassword);
    if (!matches) {
        throw new CustomError("Password did not match", 400);
    }

    // generate json web token
    const token = jwtUtils.generateToken({
        userId: user.userId,
        email: user.email,
        userType: user.userType,
    });

    return token;
}
async function logout(email, password) {}

async function changePassword(userId, originalPassword, newPassword) {
    const hashedPassword = await UserRepository.findPasswordByUserId(userId);
    if (!hashedPassword) {
        throw new CustomError("User not found");
    }

    const originalHash = await passwordUtils.hashPassword(originalPassword);
    if (originalHash !== hashedPassword) {
        throw new CustomError("Password did not matched", 400);
    }

    const newHashedPassword = await passwordUtils.hashPassword(newPassword);
    await UserRepository.updatePasswordByUserId(userId, newHashedPassword);
}

async function generateOTP(email) {
    const otp = passwordUtils.generateOTP(6);

    // for 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTPRepository.createOTP(email, otp, expiresAt);

    // send mail to user
    emailUtils.sendEmailWithOTP(email, user.name, otp);
}

async function verifyOTP(email, otp) {
    const OTP = await OTPRepository.findOTP(email);
    if (OTP && OTP == otp) return true;
    return false;
}

async function resetPassword(email, otp, password) {
    const OTP = await OTPRepository.findOTP(email);

    if (!OTP || otp != OTP.otp) {
        throw new CustomError("Your OTP is expired", 400);
    }

    const hashedPassword = await passwordUtils.hashPassword(password);
    await UserRepository.updatePasswordByEmail(email, hashedPassword);
}

export default {
    login,
    logout,
    changePassword,
    generateOTP,
    verifyOTP,
    resetPassword,
};
