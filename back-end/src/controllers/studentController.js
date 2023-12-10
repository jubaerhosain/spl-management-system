import { GenericResponse } from "../utils/responseUtils.js";
import studentService from "../services/studentService.js";
import CustomError from "../utils/CustomError.js";
import utils from "../utils/utils.js";
import Joi from "../utils/validator/Joi.js";
import {
    validateName,
    validateEmail,
    validateRollNo,
    validateBatch,
    validateRegistrationNo,
    validateSession,
    validateCurriculumYear,
    validatePhoneNumber,
    validateGender,
} from "../utils/validator/JoiValidationFunction.js";

async function createStudent(req, res) {
    try {
        const schema = Joi.object({
            students: Joi.array()
                .min(1)
                .items(
                    Joi.object({
                        name: Joi.string().trim().custom(validateName).required(),
                        email: Joi.string().trim().email().custom(validateEmail).required(),
                        rollNo: Joi.string().trim().custom(validateRollNo).required(),
                        registrationNo: Joi.string().trim().custom(validateRegistrationNo).required(),
                        batch: Joi.string().trim().custom(validateBatch).required(),
                        session: Joi.string().trim().custom(validateSession).required(),
                        curriculumYear: Joi.string().trim().custom(validateCurriculumYear).required(),
                    })
                )
                .required(),
        }).required();

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const validateDuplicate = (students) => {
            const error = {};
            const emails = students.map((student) => student.email);
            const rollNos = students.map((student) => student.rollNo);
            const registrationNos = students.map((student) => student.registrationNo);

            students.forEach((student, index) => {
                if (utils.countOccurrences(emails, student.email) > 1) {
                    error[`students[${index}].email`] = {
                        msg: "duplicate email not allowed",
                        value: student.email,
                    };
                }
                if (utils.countOccurrences(rollNos, student.rollNo) > 1) {
                    error[`students[${index}].rollNo`] = {
                        msg: "duplicate roll not allowed",
                        value: student.rollNo,
                    };
                }
                if (utils.countOccurrences(registrationNos, student.registrationNo) > 1) {
                    error[`students[${index}].registrationNo`] = {
                        msg: "duplicate registration not allowed",
                        value: student.registrationNo,
                    };
                }
            });

            if (Object.keys(error).length === 0) return null;

            return error;
        };

        const { students } = req.body;
        const error1 = validateDuplicate(students);
        if (error1)
            return res
                .status(400)
                .json(GenericResponse.error("Duplicate email, roll, registration are not allowed", error1));

        await studentService.createStudent(students);

        res.json(GenericResponse.success("Student accounts are created successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
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
        const updateStudentSchema = Joi.object({
            name: Joi.string().trim().custom(validateName).optional(),
            gender: Joi.string().trim().custom(validateGender).optional(),
            phone: Joi.string().trim().custom(validatePhoneNumber).optional(),
            details: Joi.string().trim().min(5).max(600).optional(),
        }).required();

        const updateStudentByAdminSchema = Joi.object({
            studentId: Joi.string().uuid().required(),
            name: Joi.string().trim().custom(validateName).optional(),
            rollNo: Joi.string().trim().custom(validateRollNo).optional(),
            registrationNo: Joi.string().trim().custom(validateRegistrationNo).optional(),
            batch: Joi.string().trim().custom(validateBatch).optional(),
            session: Joi.string().trim().custom(validateSession).optional(),
            curriculumYear: Joi.string().trim().custom(validateCurriculumYear).optional(),
        }).required();

        const student = req.body;

        if (utils.isObjectEmpty(student)) {
            return res.status(400).json(GenericResponse.error("At least one field must be provided"));
        }

        if (req.user.userType === "admin") {
            const { error } = updateStudentByAdminSchema.validate(student);
            if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

            await studentService.updateStudentByAdmin(student.studentId, student);
        } else if (req.user.userType === "student") {
            const { error } = updateStudentSchema.validate(student);
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
