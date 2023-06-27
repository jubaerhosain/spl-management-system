import { Response } from "../utils/responseUtils.js";
import studentService from "../services/studentService.js";
import emailService from "../services/emailServices/emailService.js";
import fileUtils from "../utils/fileUtils.js";
import CustomError from "../utils/CustomError.js";

async function createStudentAccount(req, res) {
    try {
        const { students } = req.body;

        const credentials = await studentService.createStudentAccount(students);

        try {
            await emailService.sendAccountCreationEmail(credentials);
        } catch (err) {
            console.log(err);
            throw new CustomError(
                "Accounts are created successfully but failed to send email with credential",
                200
            );
        }

        try {
            fileUtils.writeCredentials(new Date() + "\n" + JSON.stringify(credentials));
        } catch (err) {
            console.log(err);
            throw new CustomError(
                "Accounts are created successfully but failed to write credentials in file ",
                200
            );
        }

        res.json(Response.success("Student accounts are created successfully"));
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(Response.error(err.message, Response.BAD_REQUEST));
        } else {
            console.log(err);
            res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
        }
    }
}

async function updateStudentAccount(req, res) {
    try {
        const student = req.body;
        const { userId } = req.user;

        await studentService.updateStudentAccount(userId, student);

        res.json(Response.success("Account is updated successfully"));
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(Response.error(err.message, Response.BAD_REQUEST));
        } else {
            console.log(err);
            res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
        }
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
