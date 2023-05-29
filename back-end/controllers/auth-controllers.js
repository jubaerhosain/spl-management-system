import { verifyPassword } from "../utilities/bcrypt-password-utilities.js";
import { generateToken } from "../utilities/jwt-token-utilities.js";
import { Response } from "../utilities/response-format-utilities.js";

// do login
async function doLogin(req, res, next) {
    try {
        const { user } = req.body;

        const matches = await verifyPassword(req.body.password, user.password);
        if (!matches) {
            res.status(400).json(Response.error("Invalid email or password"));
            return;
        }

        // delete password from user
        delete user.password;

        // generate json web token
        const token = generateToken(user);

        // set signed cookie
        res.cookie(process.env.AUTH_COOKIE_NAME, token, {
            httpOnly: true,
            maxAge: process.env.JWT_EXPIRY,
            signed: true,
        });

        // send to the user
        res.status(200).json(Response.success("Login successful", { userType: user.userType }));
    } catch (err) {
        console.log(err);
        res.status(400).json(Response.error("Invalid email or password"));
    }
}

async function doLogout(req, res, next) {
    try {
        console.log(process.env.AUTH_COOKIE_NAME);
        res.clearCookie(process.env.AUTH_COOKIE_NAME);
        res.json(Response.success("Logged out successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

export { doLogin, doLogout };
