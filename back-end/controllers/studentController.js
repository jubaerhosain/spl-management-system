import { Response } from "../utils/responseUtils.js";
import studentService from "../services/studentService.js";

async function createStudentAccount(req, res) {
    try {
        const { students } = req.body;

        await studentService.createStudentAccount(students);

        res.json(Response.success("Student accounts are created successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

async function updateStudentAccount(req, res) {
    try {
        const student = req.body;
        const { userId } = req.user;

        await studentService.updateStudentAccount(userId, student);

        res.json(Response.success("Account is updated successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

async function updateStudentAccountByAdmin(req, res) {
    try {
        const student = req.body;
        const { studentId } = req.params;

        await studentService.updateStudentAccountByAdmin(studentId, student);

        res.json(Response.success("Student account is updated successfully"));
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(Response.error(err.message, Response.BAD_REQUEST));
        } else {
            console.log(err);
            res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
        }
    }
}

export default {
    createStudentAccount,
    updateStudentAccount,
    updateStudentAccountByAdmin,
};
