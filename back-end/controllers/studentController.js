import { Response } from "../utils/responseUtils.js";

import studentService from "../services/studentService.js";

async function addStudent(req, res) {
    try {
        const { students } = req.body;

        await studentService.addStudent(students);

        res.json(Response.success("Student accounts are created successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

async function updateStudent(req, res) {
    try {
        const student = req.body;
        const { userId } = req.user;

        await studentService.updateStudent(userId, student);

        res.json(Response.success("Account is updated successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

/**
 * Update some special fields of student by admin
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function updateStudentByAdmin(req, res) {
    try {
        const student = req.body;
        const { studentId } = req.params;

        await studentService.updateStudentByAdmin(studentId, student);

        res.json(Response.success("Student account is updated successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.SERVER_ERROR)
        );
    }
}

export default {
    addStudent,
    updateStudent,
    updateStudentByAdmin,
};
