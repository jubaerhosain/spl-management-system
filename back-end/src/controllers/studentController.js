import { GenericResponse } from "../utils/responseUtils.js";
import studentService from "../services/student/index.js";
import CustomError from "../utils/CustomError.js";
import studentValidator from "../validators/studentValidator.js";
import utils from "../utils/utils.js";
import Joi from "joi";

async function createStudent(req, res) {
    try {
        const { students } = req.body;

        if (!students || students.length === 0)
            return res.status(400).json(GenericResponse.error("At least one student information must be provided"));

        const { error } = studentValidator.createStudentSchema.validate(students);
        if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

        const error1 = studentValidator.validateCreateStudentDuplicates(students);
        if (error1)
            return res
                .status(400)
                .json(GenericResponse.error("duplicate email, roll, registration are not allowed", error1));

        const error2 = await studentValidator.validateCreateStudentExistence(students);
        if (error2)
            return res
                .status(400)
                .json(GenericResponse.error("existed email, roll, registration are not allowed", error2));

        await studentService.createStudent(students);

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

async function getStudent(req, res) {
    try {
        const { studentId } = req.params;
        const student = await studentService.getStudent(studentId);

        if (utils.isObjectEmpty(student)) return res.status(400).json(GenericResponse.error("Student not found"));

        res.json(GenericResponse.success("Student is retrieved successfully", student));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred while retrieving student"));
        }
    }
}

async function getAllStudent(req, res) {
    try {
        // add pagination logic later
        const options = req.query;
        let students;
        if (utils.isObjectEmpty(options)) {
            students = await studentService.getAllStudent();
        } else if (options.curriculumYear) {
            students = await studentService.getAllStudentByCurriculumYear(options.curriculumYear);
        } else if (options.inactive) {
            students = await studentService.getAllInactiveStudents();
        }

        res.json(GenericResponse.success("Students are retrieved successfully", students));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred while retrieving student"));
        }
    }
}

async function updateStudent(req, res) {
    try {
        const student = req.body;

        if (utils.isObjectEmpty(student)) {
            return res.status(400).json(GenericResponse.error("At least one field must be provided"));
        }

        if (req.user.userType === "admin") {
            const { error } = studentValidator.updateStudentByAdminSchema.validate(student);
            if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

            await studentService.updateStudentByAdmin(student.studentId, student);
        } else if (req.user.userType === "student") {
            const { error } = studentValidator.updateStudentSchema.validate(student);
            if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

            await studentService.updateStudent(req.user.userId, student);
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

async function deleteStudent(req, res) {}

async function requestTeacher(req, res) {
    try {
        const schema = Joi.object({
            teacherId: Joi.string().uuid().required(),
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

        const { studentId } = req.params;
        const { teacherId } = req.body;
        await studentService.requestTeacher(studentId, teacherId);

        res.json(GenericResponse.success("Request sent successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred while requesting teacher"));
        }
    }
}

async function getStudentRequest(req, res) {
    // if a teacher requested this student or not providing teacherId
}

async function getAllStudentRequest(req, res) {}
async function deleteStudentRequest(req, res) {}

async function getCurrentSPL(req, res) {
    try {
        const { studentId } = req.params;
        const spl = await studentService.getCurrentSPL(studentId);
        res.json(GenericResponse.success("Retrieved successfully", spl));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred while updating account"));
        }
    }
}

async function getAllSPL(req, res) {}

async function assignSupervisorToStudent(req, res) {
    try {
        const { studentId } = req.params;
        const { splId, teacherId } = req.body;

        if (!splId || !teacherId)
            return res.status(400).json(GenericResponse.error("splId and supervisorId both must be provided"));

        await studentService.assignSupervisorToStudent(splId, studentId, teacherId);

        res.json(GenericResponse.success("Supervisor assigned successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred while assigning supervisor"));
        }
    }
}
async function getCurrentSupervisor(req, res) {}
async function getAllSupervisor(req, res) {}

async function getAllTeam(req, res) {}
async function getCurrentTeam(req, res) {}

export default {
    createStudent,
    getStudent,
    getAllStudent,
    updateStudent,
    deleteStudent,
    requestTeacher,
    getStudentRequest,
    getAllStudentRequest,
    deleteStudentRequest,
    getCurrentSPL,
    getAllSPL,
    assignSupervisorToStudent,
    getAllSupervisor,
    getCurrentSupervisor,
    getAllTeam,
    getCurrentTeam,
};
