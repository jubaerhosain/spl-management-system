import jwtUtils from "../utils/jwtUtils.js";
import { GenericResponse } from "../utils/responseUtils.js";

/**
 * Puts req.user = user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function checkAuthentication(req, res, next) {
    try {
        const bearerToken = req.headers.authorization;
        const authToken = bearerToken ? bearerToken.split(" ")[1] : null;
        const signedCookie = req.signedCookies[process.env.AUTH_COOKIE_NAME];

        // console.log(req.signedCookies);
        // console.log("Auth token", authToken);
        // console.log("Signed cookie", signedCookie);

        const token = signedCookie || authToken;

        if (!token) {
            res.status(401).json(GenericResponse.error("Authentication failed", GenericResponse.UNAUTHORIZED));
            return;
        }

        const decoded = jwtUtils.verifyToken(token);

        if (!decoded) {
            res.status(401).json(GenericResponse.error("Authentication failed", GenericResponse.UNAUTHORIZED));
            return;
        }

        // put decoded token into req.user
        req.user = decoded;

        next();
    } catch (err) {
        console.log(err);
        res.status(400).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
    }
}

export async function isAdmin(req, res, next) {
    const user = req.user;
    if (user.userType === "admin") {
        next();
    } else {
        res.status(403).json(GenericResponse.error("You are not allowed", GenericResponse.FORBIDDEN));
    }
}

export async function isTeacher(req, res, next) {
    const user = req.user;
    if (user.userType === "teacher") {
        next();
    } else {
        res.status(403).json(GenericResponse.error("You are not allowed", GenericResponse.FORBIDDEN));
    }
}

export async function isStudent(req, res, next) {
    const user = req.user;
    if (user.userType === "student") {
        next();
    } else {
        res.status(403).json(GenericResponse.error("You are not allowed", GenericResponse.FORBIDDEN));
    }
}

export async function isCommitteeHead(req, res, next) {}
export async function isCommitteeMember(req, res, next) {}
export async function isSPLManager(req, res, next) {}
export async function isPresentationEvaluator(req, res, next) {}

export default {
    checkAuthentication,
    isAdmin,
    isTeacher,
    isStudent,
    isCommitteeHead,
    isCommitteeMember,
    isSPLManager,
    isPresentationEvaluator,
};
