import createError from "http-errors";
import { models, Op } from "../../database/db.js";
import { createMappedError } from "../../utilities/response-format-utilities.js";
import { body, body_param } from "../custom-validator.js";


/**
 * 1. Check if studentId exist/active in database or not
 * 2. Throw if not exist
 */
const studentIdExistence = body_param("studentId").custom(async (studentId) => {
    try {
        const student = await models.User.findOne({
            where: {
                userId: studentId,
                active: true,
                userType: "student",
            },
            attributes: ["userId"],
            raw: true,
        });

        if (!student) {
            throw new createError(400, "Not exists");
        }
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error.";
        throw new Error(message);
    }
});

/**
 * 1. Checks if rollNo exists in database or not
 * 2. Throw if exist
 */
const checkRollNoExistence = body("rollNo").custom(async (rollNo) => {
    try {
        const roll = await models.Student.findOne({
            where: {
                rollNo,
            },
            attributes: ["rollNo"],
            raw: true,
        });

        if (roll) {
            throw new createError(409, "Already exists");
        }
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error.";
        throw new Error(message);
    }
});

/**
 * 1. Checks if registrationNo exists in database or not
 * 2. Throw if exists
 */
const checkRegistrationNoExistence = body("registrationNo").custom(async (registrationNo) => {
    try {
        const registration = await models.Student.findOne({
            where: {
                registrationNo,
            },
            attributes: ["registrationNo"],
            raw: true,
        });

        if (registration) {
            throw new createError(409, "Already exists");
        }
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error.";
        throw new Error(message);
    }
});

/**
 * Check existence of students email, rollNo and registrationNo
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function addStudentDbCheck(req, res, next) {
    try {
        const { students } = req.body;

        // check email existence
        const emails = students.map((student) => student.email);
        const studentEmails = await models.User.findAll({
            where: {
                email: {
                    [Op.in]: emails,
                },
            },
            raw: true,
            attributes: ["email"],
        });

        if (studentEmails.length > 0) {
            const existedEmails = studentEmails.map((student) => student.email);
            const error = createMappedError({
                param: "students",
                value: existedEmails,
                msg: "Following emails are already exists.",
                location: "body",
            });
            res.status(400).json(error);
            return;
        }

        // check roll numbers are exists in Student database or not
        const rolls = students.map((student) => student.rollNo);
        const studentRolls = await models.Student.findAll({
            where: {
                rollNo: { [Op.in]: rolls },
            },
            raw: true,
            attributes: ["rollNo"],
        });

        if (studentRolls.length > 0) {
            const existedRolls = studentRolls.map((student) => student.rollNo);
            const error = createMappedError({
                param: "students",
                value: existedRolls,
                msg: "Following roll numbers are already exists.",
                location: "body",
            });
            res.status(400).json(error);
            return;
        }

        // check registration numbers are exists in database or not
        const registrations = students.map((student) => student.registrationNo);
        const studentRegs = await models.Student.findAll({
            where: {
                registrationNo: {
                    [Op.in]: registrations,
                },
            },
            raw: true,
            attributes: ["registrationNo"],
        });

        if (studentRegs.length > 0) {
            const existedRegs = studentRegs.map((student) => student.registrationNo);
            const error = createMappedError({
                param: "students",
                value: existedRegs,
                msg: "Following registration numbers are already exists.",
                location: "body",
            });
            res.status(400).json(error);
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error.";
        next(new createError(err.status || 500, message));
    }
}

/**
 * Check if rollNo and registrationNo exists in database or not
 */
const updateStudentByAdminDbCheck = [
    checkRollNoExistence.optional(),
    checkRegistrationNoExistence.optional(),
];

export {
    studentIdExistence,
    checkRollNoExistence,
    checkRegistrationNoExistence,
    addStudentDbCheck,
    updateStudentByAdminDbCheck,
};
