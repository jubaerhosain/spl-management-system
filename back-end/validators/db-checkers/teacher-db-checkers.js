import createError from "http-errors";
import { createMappedError } from "../../utilities/response-format-utilities.js";
import { body_param, validationResult } from "../custom-validator.js";
import { models, Op } from "../../database/db.js";


const teacherIdExistence = body_param("teacherId")
    .if((value, { req }) => validationResult(req).isEmpty())
    .custom(async (teacherId, { req }) => {
        try {
            const teacher = await models.User.findOne({
                where: {
                    active: true,
                    userId: teacherId,
                    userType: "teacher",
                },
                attributes: ["userId"],
                raw: true,
            });

            if (!teacher) {
                const message = `Teacher doesn't exists`;
                throw new createError(400, message);
            }
        } catch (err) {
            console.log(err);
            const message = err.status ? err.message : "Internal server error";
            throw new Error(message);
        }
    });

/**
 * Check existence of email
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function addTeacherDbCheck(req, res, next) {
    try {
        const {teachers} = req.body;
        const emails = teachers.map(teacher => teacher.email);

        // console.log(emails, teachers);

        const userEmails = await models.User.findAll({
            where: {
                email: {
                    [Op.in]: emails,
                },
            },
            raw: true,
            attributes: ["email"],
        });

        if (userEmails.length > 0) {
            const existedEmails = userEmails.map((teacher) => teacher.email);
            const error = createMappedError({
                param: "emails",
                value: existedEmails,
                msg: "Following emails are already exists",
                location: "body",
            });
            res.status(400).json(error);
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error.";
        throw new Error(message);
    }
}

export { teacherIdExistence, addTeacherDbCheck };
