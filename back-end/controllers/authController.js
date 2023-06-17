import passwordUtilities from "../utilities/passwordUtilities.js";
import jwtUtilities from "../utilities/jwtUtilities.js";

import { Response } from "../utilities/response-format-utilities.js";
import { sendEmailWithOTP } from "../utilities/email-utilities.js";

import OTPRepository from "../repositories/OTPRepository.js";
import UserRepository from "../repositories/UserRepository.js";

async function doLogin(req, res) {
    try {
        const { email, password, checked } = req.body;

        if (!email || !password) {
            res.status(400).json(
                Response.error("Both email and password must be provided", Response.BAD_REQUEST)
            );
            return;
        }

        const user = await UserRepository.findByEmailWithPassword(email);

        if (!user) {
            res.status(400).json(Response.error("Invalid email or password", Response.BAD_REQUEST));
            return;
        }

        const matches = await passwordUtilities.verifyPassword(password, user.password);
        if (!matches) {
            res.status(400).json(Response.error("Invalid email or password", Response.BAD_REQUEST));
            return;
        }

        // generate json web token
        const token = jwtUtilities.generateToken({
            userId: user.userId,
            email: user.email,
            userType: user.userType,
        });

        // set signed cookie
        res.cookie(process.env.AUTH_COOKIE_NAME, token, {
            httpOnly: true,
            maxAge: checked ? process.env.JWT_EXPIRY : null,
            signed: true,
        });

        // send to the user
        res.status(200).json(Response.success("Login successful"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

async function doLogout(req, res, next) {
    try {
        res.clearCookie(process.env.AUTH_COOKIE_NAME);
        res.json(Response.success("Logged out successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

async function changePassword(req, res, next) {
    try {
        const { originalPassword, newPassword } = req.body;
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

async function generateOTP(req, res, next) {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json(Response.error("Email must be provided", Response.BAD_REQUEST));
            return;
        }

        const user = await UserRepository.findByEmail(email);

        if (!user) {
            res.status(400).json(Response.error("Email does not exist", Response.BAD_REQUEST));
            return;
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await OTPRepository.createOTP(email, otp, expiresAt);

        // send mail
        sendEmailWithOTP(email, user.name, otp);

        // send message to mobile number

        res.json(Response.success("An OTP has been sent to your email"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

async function verifyOTP(req, res, next) {
    try {
        const { email, otp } = req.body;
        const OTP = await OTPRepository.findOTP(email);

        if (OTP && otp == OTP.otp) {
            res.json(Response.success("OTP verified successfully"));
        } else {
            res.status(400).json(Response.error("Invalid OTP or expired", Response.BAD_REQUEST));
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

async function resetPassword(req, res, next) {
    try {
        // validate password in previous middleware

        const { email, otp, password } = req.body;

        const OTP = await OTPRepository.findOTP(email);

        if (!OTP || otp != OTP.otp) {
            res.status(400).json(Response.error("Your OTP is expired", Response.BAD_REQUEST));
            return;
        }

        const hashedPassword = await passwordUtilities.hashPassword(password);
        await UserRepository.resetPassword(email, hashedPassword);

        res.json(Response.success("Password reset successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

export default { doLogin, doLogout, changePassword, generateOTP, verifyOTP, resetPassword };
