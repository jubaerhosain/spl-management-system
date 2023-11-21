import { GenericResponse } from "../utils/responseUtils.js";
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
            throw new CustomError("Accounts are created successfully but failed to send email with credential", 400);
        }

        try {
            fileUtils.writeCredentials(new Date() + "\n" + JSON.stringify(credentials));
        } catch (err) {
            console.log(err);
            throw new CustomError("Accounts are created successfully but failed to write credentials in file ", 400);
        }

        res.json(GenericResponse.success("Student accounts are created successfully"));
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(GenericResponse.error(err.message));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred while creating student account"));
        }
    }
}

async function updateStudentAccount(req, res) {
    try {
        const student = req.body;
        const { userId } = req.user;

        await studentService.updateStudentAccount(userId, student);

        res.json(GenericResponse.success("Account is updated successfully"));
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(GenericResponse.error(err.message));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred while updating account"));
        }
    }
}

// async function updateStudentAccountByAdmin(req, res) {
//     try {
//         const student = req.body;
//         const { studentId } = req.params;

//         await studentService.updateStudentAccountByAdmin(studentId, student);

//         res.json(GenericResponse.success("Student account is updated successfully"));
//     } catch (err) {
//         if (err.status) {
//             res.status(err.status).json(GenericResponse.error(err.message));
//         } else {
//             console.log(err);
//             res.status(500).json(GenericResponse.error("Internal Server Error"));
//         }
//     }
// }

export default {
    createStudentAccount,
    updateStudentAccount,
};
