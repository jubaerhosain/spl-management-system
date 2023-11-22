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

        const error1 = studentValidator.validateCreateStudentDuplicates(students);
        if (error1)
            return res.status(400).json(GenericResponse.error("duplicate email, roll, registration are not allowed", error1));

        const error2 = await studentValidator.validateCreateStudentExistence(students);
        if (error2)
            return res.status(400).json(GenericResponse.error("existed email, roll, registration are not allowed", error2));

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

        if(Object.keys(student).length == 0) {
            return res.status(400).json(GenericResponse.error("At least one field must be provided"))
        }

        if (req.user.userType === "admin") {
            const { error } = studentValidator.updateStudentByAdminSchema.validate(student);
            if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

            await studentService.updateStudentAccountByAdmin(student.studentId, student);
        } else if (req.user.userType === "student") {
            const { error } = studentValidator.updateStudentSchema.validate(student);
            if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

            await studentService.updateStudentAccount(req.user.userId, student);
        }

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
