import { models, Op } from "../database/db.js";
import { Response } from "../utilities/response-format-utilities.js";
import { isUnique } from "../utilities/common-utilities.js";

/**
 * Checks uniqueness of teacher email
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function checkAddTeacherUniqueness(req, res, next) {
    try {
        const { teachers } = req.body;

        // check duplicate email
        if (!isUnique(teachers.map((teacher) => teacher.email))) {
            res.status(400).json(Response.error("Duplicate emails are not allowed"));
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
    }
}

/**
 * Check existence of teacher email
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function checkAddTeacherExistence(req, res, next) {
    try {
        const { teachers } = req.body;

        // check email existence
        const existedEmails = await models.User.findAll({
            where: {
                email: {
                    [Op.in]: teachers.map((teacher) => teacher.email),
                },
            },
            raw: true,
            attributes: ["email"],
        });

        if (existedEmails.length > 0) {
            res.status(400).json(
                Response.error(
                    "Following emails are already exists",
                    Response.EMAIL_EXIST,
                    existedEmails.map((teacher) => teacher.email)
                )
            );
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
    }
}
