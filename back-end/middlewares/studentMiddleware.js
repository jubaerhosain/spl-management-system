import UserRepository from "../repositories/UserRepository.js";
import StudentRepository from "../repositories/StudentRepository.js";
import { Response } from "../utils/responseUtils.js";
import commonUtils from "../utils/commonUtils.js";

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
        if (!commonUtils.isUnique(students.map((student) => student.email))) {
            res.status(400).json(
                Response.error("Duplicate emails are not allowed", Response.BAD_REQUEST)
            );
            return;
        }

        // check duplicate roll numbers
        if (!commonUtils.isUnique(students.map((student) => student.rollNo))) {
            res.status(400).json(
                Response.error("Duplicate roll numbers are not allowed", Response.BAD_REQUEST)
            );
            return;
        }

        // check duplicate registration numbers
        if (!commonUtils.isUnique(students.map((student) => student.registrationNo))) {
            res.status(400).json(
                Response.error(
                    "Duplicate registration numbers are not allowed",
                    Response.BAD_REQUEST
                )
            );
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
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

        const errors = [];

        // check email existence
        const emails = students.map((student) => student.email);
        const existedEmails = await UserRepository.findAllEmails(emails);
        if (existedEmails) {
            errors.push({
                message: "Following emails are already exists",
                data: existedEmails,
            });
        }

        // check roll numbers are exists in Student database or not
        const rollNumbers = students.map((student) => student.rollNo);
        const existedRolls = await StudentRepository.findAllRollNumbers(rollNumbers);
        if (existedRolls) {
            errors.push({
                message: "Following roll numbers are already exists",
                data: existedRolls,
            });
        }

        // check registration numbers are exists in database or not
        const regNumbers = students.map((student) => student.registrationNo);
        const existedRegs = await StudentRepository.findAllRegistrationNumbers(regNumbers);
        if (existedRegs) {
            errors.push({
                message: "Following registration numbers are already exists.",
                data: existedRegs,
            });
        }

        if (errors.length > 0) {
            res.status(400).json(
                Response.error("Following data are already exists", Response.ARRAY_DATA, errors)
            );
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}
