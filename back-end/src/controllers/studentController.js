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
    validateSPLName,
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
        const schema = Joi.object({
            curriculumYear: Joi.string().trim().custom(validateCurriculumYear).optional(),
            inactive: Joi.boolean().optional(),
            batch: Joi.number().integer().optional(),
        });
        const options = req.query;
        const { error } = schema.validate(options);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const students = await studentService.getAllStudent(options);

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
            gender: Joi.string().trim().custom(validateGender).optional(),
            phone: Joi.string().trim().custom(validatePhoneNumber).optional(),
            details: Joi.string().trim().min(5).max(600).optional(),
        })
            .min(1)
            .required();

        const updateStudentByAdminSchema = Joi.object({
            name: Joi.string().trim().custom(validateName).optional(),
            rollNo: Joi.string().trim().custom(validateRollNo).optional(),
            registrationNo: Joi.string().trim().custom(validateRegistrationNo).optional(),
            batch: Joi.string().trim().custom(validateBatch).optional(),
            session: Joi.string().trim().custom(validateSession).optional(),
            curriculumYear: Joi.string().trim().custom(validateCurriculumYear).optional(),
        })
            .min(1)
            .required();

        const student = req.body;
        const { studentId } = req.params;
        if (req.user.userType === "admin") {
            const { error } = updateStudentByAdminSchema.validate(student);
            if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

            await studentService.updateStudent(studentId, student, "admin");
        } else if (req.user.userType === "student") {
            const { error } = updateStudentSchema.validate(student);
            if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

            await studentService.updateStudent(studentId, student, "student");
        } else {
            return res.status(401).json(GenericResponse.error("You are not allowed to update"));
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
        }).required();

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

async function deleteStudentRequest(req, res) {
    try {
        const { studentId, requestId } = req.params;
        await studentService.deleteStudentRequest(studentId, requestId);

        res.json(GenericResponse.success("Request deleted successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function getAllSPL(req, res) {
    try {
        const schema = Joi.object({
            active: Joi.boolean().optional(),
            splName: Joi.string().trim().custom(validateSPLName).optional(),
            supervisor: Joi.boolean().optional(),
            project: Joi.boolean().optional(),
        });
        const { error } = schema.validate(req.query);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const { studentId } = req.params;
        const options = req.query;
        const spls = await studentService.getAllSPL(studentId, options);
        res.json(GenericResponse.success("SPLs retrieved successfully", spls));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function assignSupervisor(req, res) {
    try {
        const schema = Joi.object({
            splId: Joi.string().trim().uuid().required(),
            teacherEmail: Joi.string().trim().email().required(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const { studentId } = req.params;
        await studentService.assignSupervisor(studentId, req.body);

        res.json(GenericResponse.success("Supervisor assigned successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function removeSupervisor(req, res) {
    try {
        const { studentId, supervisorId } = req.params;
        const project = await studentService.removeSupervisor(studentId, supervisorId);
        res.json(GenericResponse.success("Project retrieved successfully", project));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function getAllTeam(req, res) {
    try {
        const schema = Joi.object({
            spl: Joi.boolean().optional(),
            supervisor: Joi.boolean().optional(),
            project: Joi.boolean().optional(),
        });
        const { error } = schema.validate(req.query);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const { studentId } = req.params;
        const options = req.query;
        const teams = await studentService.getAllTeam(studentId, options);
        res.json(GenericResponse.success("Teams are retrieved successfully", teams));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function getAllProject(req, res) {
    try {
        const schema = Joi.object({
            spl: Joi.boolean().optional(),
            supervisor: Joi.boolean().optional(),
        });
        const { error } = schema.validate(req.query);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const { studentId } = req.params;
        const options = req.query;
        const projects = await studentService.getAllProject(studentId, options);
        res.json(GenericResponse.success("Projects are retrieved successfully", projects));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function getCurrentProject(req, res) {
    try {
        const schema = Joi.object({
            progress: Joi.boolean().optional(),
            spl: Joi.boolean().optional(),
            supervisor: Joi.boolean().optional(),
        });
        const { error } = schema.validate(req.query);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const { studentId } = req.params;
        const options = req.query;
        const project = await studentService.getCurrentProject(studentId, options);
        res.json(GenericResponse.success("Project retrieved successfully", project));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

export default {
    createStudent,
    getStudent,
    getAllStudent,
    updateStudent,
    deleteStudent,
    requestTeacher,
    deleteStudentRequest,
    getAllSPL,
    assignSupervisor,
    removeSupervisor,
    getAllTeam,
    getAllProject,
    getCurrentProject,
};
