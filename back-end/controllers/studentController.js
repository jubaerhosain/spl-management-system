import { GenericResponse } from "../utils/responseUtils.js";
import studentService from "../services/studentService.js";
import emailService from "../services/emailServices/emailService.js";
import fileUtils from "../utils/fileUtils.js";
import CustomError from "../utils/CustomError.js";
import studentValidator from "../validators/studentValidator.js";

async function createStudentAccount(req, res) {
    try {
        const { students } = req.body;

        if (!students || students.length === 0)
            return res.status(400).json(GenericResponse.error("Please! provided student information"));

        const { error } = studentValidator.createStudentSchema.validate(students);
        if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

        const duplicateError = studentValidator.validateDuplicates(students);
        if (duplicateError) return res.status(400).json(GenericResponse.error("duplicate data is not allowed", duplicateError));

        return;

        await studentService.createStudentAccount(students);

        res.json(GenericResponse.success("Student accounts are created successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
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
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
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
