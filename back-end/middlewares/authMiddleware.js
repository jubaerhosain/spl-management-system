// 1. check authentication
// 2. check authorization [admin, student, teacher]
// 3. check authorization [committee head, committee member, splmanager, presentation evaluators]

import jwtUtils from "../utils/jwtUtils.js";
import { Response } from "../utils/responseUtils.js";

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
        // console.log("Auth token", authToken);
        // console.log("Signed cookie", signedCookie);

        const token = signedCookie || authToken;

        if (!token) {
            res.status(401).json(Response.error("Authentication failed", Response.UNAUTHORIZED));
            return;
        }

        const decoded = jwtUtils.verifyToken(token);

        // put decoded token into req.user
        req.user = decoded;

        // console.log("Authenticated user: ", decoded);

        next();
    } catch (err) {
        console.log(err);
        res.status(400).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

async function isAdmin(req, res, next) {}
async function isTeacher(req, res, next) {}
async function isStudent(req, res, next) {}
async function isCommitteeHead(req, res, next) {}
async function isCommitteeMember(req, res, next) {}
async function isSPLManager(req, res, next) {}
async function isPresentationEvaluator(req, res, next) {}

export default { checkAuthentication };
