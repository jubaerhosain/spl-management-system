import config from "../config/config.js";
import { Response } from "../utils/responseUtils.js";
import authService from "../services/authService.js";
import UserRepository from "../repositories/UserRepository.js";

async function login(req, res) {
    try {
        const { email, password, checked } = req.body;

        const token = await authService.login(email, password);

        res.cookie(process.env.AUTH_COOKIE_NAME, token, {
            httpOnly: true,
            maxAge: checked ? config.jwt.expiry : null,
            signed: true,
        });

        res.json(Response.success("Login successful"));
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(400).json(Response.error("Invalid email or password", Response.BAD_REQUEST));
        } else {
            res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
        }
    }
}

async function logout(req, res) {
    try {
        // do the stuffs in authService.logout if needed

        res.clearCookie(config.cookie.authCookieName);
        res.json(Response.success("Logged out successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

async function changePassword(req, res) {
    try {
        const { userId } = req.user;
        const { oldPassword, newPassword } = req.body;

        await authService.changePassword(userId, oldPassword, newPassword);

        res.json(Response.success("Password changed successfully"));
    } catch (err) {
        console.log(err);
        if (err.status == 400) {
            res.status(err.status).json(
                Response.error(err.message, Response.VALIDATION_ERROR, {
                    oldPassword: {
                        msg: err.message,
                    },
                })
            );
        } else {
            res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
        }
    }
}

async function generateOTP(req, res) {
    try {
        const { email } = req.body;

        await authService.generateOTP(email);

        res.json(Response.success("An OTP has been sent to your email"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

async function verifyOTP(req, res) {
    try {
        const { email, otp } = req.body;

        await authService.verifyOTP(email, otp);

        res.json(Response.success("OTP verified successfully"));
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(err.status).json(
                Response.error(err.message, Response.VALIDATION_ERROR, {
                    otp: {
                        msg: err.message,
                    },
                })
            );
        } else {
            res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
        }
    }
}

async function resetPassword(req, res) {
    try {
        const { email, otp, password } = req.body;

        await authService.resetPassword(email, otp, password);

        res.json(Response.success("Password reset successfully"));
    } catch (err) {
        console.log(err);
        if (err.status == 400) {
            res.status(400).json(Response.error(err.message, Response.BAD_REQUEST));
        } else {
            res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
        }
    }
}

export default { login, logout, changePassword, generateOTP, verifyOTP, resetPassword };