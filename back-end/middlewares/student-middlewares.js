import { models, Op } from "../database/db.js";
import { Response } from "../utilities/response-format-utilities.js";
import { isUnique } from "../utilities/common-utilities.js";

/**
 * Checks uniqueness of email, rollNo and registrationNo
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function checkAddStudentUniqueness(req, res, next) {
    try {
        const { students } = req.body;

        // check duplicate email
        if (!isUnique(students.map((student) => student.email))) {
            res.status(400).json(Response.error("Duplicate emails are not allowed"));
            return;
        }

        // check duplicate roll numbers
        if (!isUnique(students.map((student) => student.rollNo))) {
            res.status(400).json(Response.error("Duplicate roll numbers are not allowed"));
            return;
        }

        // check duplicate registration numbers
        if (!isUnique(students.map((student) => student.registrationNo))) {
            res.status(400).json(Response.error("Duplicate registration numbers are not allowed"));
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
 * Check existence of students email, rollNo and registrationNo
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function checkAddStudentExistence(req, res, next) {
    try {
        const { students } = req.body;

        // check email existence
        const existedEmails = await models.User.findAll({
            where: {
                email: {
                    [Op.in]: students.map((student) => student.email),
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
                    existedEmails.map((student) => student.email)
                )
            );
            return;
        }

        // check roll numbers are exists in Student database or not
        const existedRolls = await models.Student.findAll({
            where: {
                rollNo: {
                    [Op.in]: students.map((student) => student.rollNo),
                },
            },
            raw: true,
            attributes: ["rollNo"],
        });

        if (existedRolls.length > 0) {
            res.status(400).json(
                Response.error(
                    "Following roll numbers are already exists",
                    Response.ROLL_EXIST,
                    existedRolls.map((student) => student.rollNo)
                )
            );
            return;
        }

        // check registration numbers are exists in database or not
        const existedRegs = await models.Student.findAll({
            where: {
                registrationNo: {
                    [Op.in]: students.map((student) => student.registrationNo),
                },
            },
            raw: true,
            attributes: ["registrationNo"],
        });

        if (existedRegs.length > 0) {
            res.status(400).json(
                Response.error(
                    "Following registration numbers are already exists.",
                    Response.REG_EXIST,
                    existedRegs.map((student) => student.registrationNo)
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

/**
 * Reads studentId from req.params \
 * Respond with error if not exist
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function checkStudentId(req, res, next) {
    try {
        const { studentId } = req.params;
        const student = await models.Student.findOne({
            where: {
                studentId: studentId,
            },
        });

        if (!student) {
            res.status(400).json(Response.error("Student not found"));
            return;
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
    }
}
