import { sequelize, models, Op } from "../database/db.js";
import { Response } from "../utils/responseUtils.js";

import studentService from "../services/studentService.js";

async function addStudent(req, res, next) {
    try {
        const { students } = req.body;

        await studentService.addStudent(students);

        res.json(Response.success("Student accounts are created successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

export async function updateStudent(req, res, next) {
    try {
        const student = req.body;
        const { userId } = req.user;

        // update to User table
        await models.User.update(student, {
            where: {
                userId: userId,
            },
        });

        res.json(Response.success("Account is updated successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
    }
}

/**
 * Update some special fields of student by admin
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function updateStudentByAdmin(req, res, next) {
    try {
        const student = req.body;
        const { studentId } = req.params;

        // update to Student table
        await models.Student.update(student, {
            where: {
                studentId,
            },
        });

        res.json(Response.success("Student account is updated successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
    }
}

export default {
    addStudent
}