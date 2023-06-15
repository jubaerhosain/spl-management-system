import { verifyPassword } from "../utilities/password-utilities.js";
import {
    generateToken,
    generateTemporaryTokenByCustomSecret,
    verifyTokenByCustomSecret,
} from "../utilities/jwt-token-utilities.js";

import { Response } from "../utilities/response-format-utilities.js";

import OTPRepository from "../repositories/OTPRepository.js";
import UserRepository from "../repositories/UserRepository.js";

async function doLogin(req, res) {
    try {
        const { email, password, remember } = req.body;

        if (!email || !password) {
            res.status(400).json(Response.error("Both email and password must be provided"));
            return;
        }

        const user = await UserRepository.findByEmailWithPassword(email);

        if (!user) {
            res.status(400).json(Response.error("Invalid email or password"));
            return;
        }

        const matches = await verifyPassword(password, user.password);
        if (!matches) {
            res.status(400).json(Response.error("Invalid email or password"));
            return;
        }

        // generate json web token
        const token = generateToken({
            userId: user.userId,
            email: user.email,
            userType: user.userType,
        });

        // set signed cookie
        res.cookie(process.env.AUTH_COOKIE_NAME, token, {
            httpOnly: true,
            maxAge: remember ? process.env.JWT_EXPIRY : null,
            signed: true,
        });

        // send to the user
        res.status(200).json(Response.success("Login successful"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function doLogout(req, res, next) {
    try {
        // console.log(process.env.AUTH_COOKIE_NAME);
        res.clearCookie(process.env.AUTH_COOKIE_NAME);
        res.json(Response.success("Logged out successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
    }
}

async function changePassword(req, res, next) {
    try {
        const { originalPassword, newPassword } = req.body;
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function generateOTP(req, res, next) {
    try {
        const { email } = req.body;

        const otp = "random otp";
        const expiresAt = new Date(Date.now() + 60 * 1000);

        // await OTPRepository.createOTP(email, otp, expiresAt);

        // send mail

        // send message

        res.json(Response.success("An OTP has been sent to your email"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function verifyOTP(req, res, next) {}

async function resetPassword(req, res, next) {
    try {
        const { email, otp, newPassword } = req.body;
        console.log(req.params);

        // verify otp again

        const user = await UserRepository.findByEmail(email);

        if (!user) {
            res.status(400).json(Response.error("User not found"));
            return;
        }

        const customSecret = process.env.JWT_SECRET + user.password;

        try {
            const decoded = verifyTokenByCustomSecret(token, customSecret);
        } catch (err) {
            res.status(400).json(Response.error("Link is expired"));
            return;
        }

        // do further works
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

export default { doLogin, doLogout, changePassword, generateOTP, verifyOTP, resetPassword };
