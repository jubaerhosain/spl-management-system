import { verifyPassword } from "../utilities/password-utilities.js";
import { generateToken } from "../utilities/jwt-token-utilities.js";
import { Response } from "../utilities/response-format-utilities.js";

import UserRepository from "../repositories/UserRepository.js";

async function doLogin(req, res, next) {
    try {
        const { email, password, remember } = req.body;

        if (!email || !password) {
            res.status(400).json(Response.error("Both email and password must be provided"));
            return;
        }

        const user = await UserRepository.findByEmail(email);

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
            name: user.name,
            userId: user.userId,
            userType: user.userType,
        });

        // set signed cookie
        if (remember) {
            res.cookie(process.env.AUTH_COOKIE_NAME, token, {
                httpOnly: true,
                maxAge: process.env.JWT_EXPIRY,
                signed: true,
            });
        } else {
            res.cookie(process.env.AUTH_COOKIE_NAME, token, {
                httpOnly: true,
                signed: true,
            });
        }

        // send to the user
        res.status(200).json(Response.success("Login successful", { userType: user.userType }));
    } catch (err) {
        console.log(err);
        res.status(400).json(Response.error("Internal Server Error"));
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

async function changePassword(req, res, next) {}

async function forgotPassword(req, res, next) {}

export default { doLogin, doLogout, changePassword, forgotPassword };
