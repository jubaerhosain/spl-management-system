import jwtUtils from "../utils/jwtUtils.js";
import emailService from "./emailServices/emailService.js";
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
    const user = await UserRepository.findLoginInfoByEmail(email);

    if (!user) {
        throw new CustomError("Email not found", 400);
    }

    const matches = await passwordUtils.verifyPassword(password, user.password);
    if (!matches) {
        throw new CustomError("Password did not match", 400);
    }

    const token = jwtUtils.generateToken({
        userId: user.userId,
        email: user.email,
        userType: user.userType,
    });

    return token;
}

async function logout(email, password) {}

async function changePassword(userId, oldPassword, newPassword) {
    const hashedPassword = await UserRepository.findPasswordByUserId(userId);

    const matches = await passwordUtils.verifyPassword(oldPassword, hashedPassword);
    if (!matches) {
        throw new CustomError("Password did not match", 400);
    }

    const newHashedPassword = await passwordUtils.hashPassword(newPassword);
    await UserRepository.updatePasswordByUserId(userId, newHashedPassword);
}

async function generateOTP(email) {
    const otp = passwordUtils.generateOTP(6);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTPRepository.createOTP(email, otp, expiresAt);

    await emailService.sendEmailWithOTP(email, otp);
}

async function verifyOTP(email, otp) {
    const actualOTP = await OTPRepository.findOTP(email);

    if (otp != actualOTP) {
        throw new CustomError("Invalid OTP or expired", 400);
    }
}

async function resetPassword(email, otp, password) {
    const actualOTP = await OTPRepository.findOTP(email);

    if (actualOTP != otp) {
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
