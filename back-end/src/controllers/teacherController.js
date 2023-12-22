import { GenericResponse } from "../utils/responseUtils.js";
import teacherService from "../services/teacherService.js";
import CustomError from "../utils/CustomError.js";
import Joi from "../utils/validator/Joi.js";
import utils from "../utils/utils.js";
import {
    validateName,
    validateEmail,
    validateDesignation,
    validateGender,
    validatePhoneNumber,
} from "../utils/validator/JoiValidationFunction.js";

async function createTeacher(req, res) {
    try {
        const schema = Joi.object({
            teachers: Joi.array()
                .min(1)
                .items(
                    Joi.object({
                        name: Joi.string().trim().custom(validateName).required(),
                        email: Joi.string().trim().email().custom(validateEmail).required(),
                        designation: Joi.string().trim().custom(validateDesignation).required(),
                    })
                )
                .required(),
        }).required();

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const validateDuplicate = (teachers) => {
            const error = {};
            const emails = teachers.map((teacher) => teacher.email);
            teachers.forEach((teacher, index) => {
                if (utils.countOccurrences(emails, teacher.email) > 1) {
                    error[`teachers[${index}].email`] = {
                        msg: "duplicate email not allowed",
                        value: teacher.email,
                    };
                }
            });

            if (Object.keys(error).length === 0) return null;

            return error;
        };

        const { teachers } = req.body;
        const error1 = validateDuplicate(teachers);
        if (error1) return res.status(400).json(GenericResponse.error("Duplicate emails are not allowed", error1));

        await teacherService.createTeacher(teachers);

        res.json(GenericResponse.success("Teacher accounts are created successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function getTeacher(req, res) {
    try {
        const { teacherId } = req.params;
        const teacher = await teacherService.getTeacher(teacherId);
        res.json(GenericResponse.success("Teacher retrieved successfully", teacher));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function getAllTeacher(req, res) {
    try {
        const schema = Joi.object({
            available: Joi.boolean().optional(),
            studentId: Joi.string().trim().uuid().optional(), // for student, find teacher with requested flag
            teamId: Joi.string().trim().uuid().optional(), // for student, find teacher with requested flag
        });

        if (req.query.studentId && req.query.teamId)
            return res
                .status(400)
                .json(GenericResponse.error("studentId and teamId both are not allowed at the same time"));

        const { error } = schema.validate(req.query);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const options = req.query;
        const teachers = await teacherService.getAllTeacher(options);
        res.json(GenericResponse.success("Teachers are retrieved successfully", teachers));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

// flag current
async function getAllStudentUnderSupervision(req, res) {}

// flag current
async function getAllTeamUnderSupervision(req, res) {}

async function updateTeacher(req, res) {
    try {
        const schema = Joi.object({
            name: Joi.string().trim().custom(validateName).optional(),
            gender: Joi.string().trim().custom(validateGender).optional(),
            phone: Joi.string().trim().custom(validatePhoneNumber).optional(),
            details: Joi.string().trim().min(5).max(600).optional(),
            designation: Joi.string().trim().custom(validateDesignation).optional(),
            available: Joi.boolean().optional(),
        })
            .min(1)
            .required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

        const teacher = req.body;
        const { teacherId } = req.params;

        await teacherService.updateTeacher(teacherId, teacher);

        res.json(GenericResponse.success("Account updated successfully"));
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(GenericResponse.error(err.message, GenericResponse.BAD_REQUEST));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
        }
    }
}

async function deleteTeacher(req, res) {}

async function getAllSupervisorRequest(req, res) {
    try {
        const { teacherId } = req.params;
        const requests = await teacherService.getAllSupervisorRequest(teacherId);
        res.json(GenericResponse.success("Supervisor requests are retrieved successfully", requests));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function acceptSupervisorRequest(req, res) {
    try {
        const schema = Joi.object({
            accept: Joi.boolean().valid(true).required(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const { teacherId, requestId } = req.params;
        const requests = await teacherService.acceptSupervisorRequest(teacherId, requestId);
        res.json(GenericResponse.success("Request accepted", requests));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function rejectSupervisorRequest(req, res) {}

export default {
    createTeacher,
    getTeacher,
    getAllTeacher,
    getAllStudentUnderSupervision,
    getAllTeamUnderSupervision,
    getAllSupervisorRequest,
    acceptSupervisorRequest,
    rejectSupervisorRequest,
    updateTeacher,
    deleteTeacher,
};
