import { verifyToken } from "../../utilities/jwt-token-utilities.js";
import { Response } from "../../utilities/response-format-utilities.js";

/**
 * Puts req.user = user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function checkAuthentication(req, res, next) {
    try {
        const bearerToken = req.headers.authorization;
        const authToken = bearerToken ? bearerToken.split(" ")[1] : null;
        const signedCookie = req.signedCookies[process.env.AUTH_COOKIE_NAME];

        // console.log(req.signedCookies);
        console.log("Auth token", authToken);
        console.log("Signed cookie", signedCookie);

        const token = signedCookie || authToken;
        const decoded = verifyToken(token);

        // put decoded token into req.user
        req.user = decoded;

        console.log("Authenticated user: ",decoded);

        next();
    } catch (err) {
        console.log(err);
        res.status(401).json(Response.error("Authentication failed"));
    }
}

export { checkAuthentication };
