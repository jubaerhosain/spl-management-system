import config from "../configs/config.js";
import { GenericResponse } from "../utils/responseUtils.js";
import authService from "../services/auth/index.js";
import authValidator from "../validators/authValidator.js";
import CustomError from "../utils/CustomError.js";

async function login(req, res) {
    try {
        const { error } = authValidator.loginFormSchema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Invalid data", error));

        const { email, password, checked } = req.body;
        const token = await authService.login(email, password);

        res.cookie(process.env.AUTH_COOKIE_NAME, token, {
            httpOnly: true,
            maxAge: checked ? config.jwt.expiry : null,
            signed: true,
        });

        return res.json(GenericResponse.success("Login successful"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error("Invalid email or password", err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred while logging in"));
        }
    }
}

async function logout(req, res) {
    try {
        res.clearCookie(config.cookie.authCookieName);
        res.json(GenericResponse.success("Logged out successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("An error occurred while logging out"));
    }
}

async function changePassword(req, res) {
    try {
        const { error } = authValidator.changePasswordFormSchema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Invalid data", error));

        const { userId } = req.user;
        const { oldPassword, newPassword } = req.body;

        await authService.changePassword(userId, oldPassword, newPassword);

        res.json(GenericResponse.success("Password changed successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred while changing password"));
        }
    }
}

async function generateOTP(req, res) {
    try {
        const { email } = req.body;

        await authService.generateOTP(email);

        GenericResponse.success(res, "An OTP has been sent to your email");
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred while generating otp"));
        }
    }
}

async function verifyOTP(req, res) {
    try {
        const { email, otp } = req.body;

        await authService.verifyOTP(email, otp);

        res.json(GenericResponse.success("OTP verified successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred while verifying otp"));
        }
    }
}

async function resetPassword(req, res) {
    try {
        const { email, otp, password } = req.body;

        await authService.resetPassword(email, otp, password);

        res.json(GenericResponse.success("Password resets successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred while resetting password"));
        }
    }
}

export default { login, logout, changePassword, generateOTP, verifyOTP, resetPassword };
