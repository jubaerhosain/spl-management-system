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
            res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
        }
    }
}

async function getTeacher(req, res) {}

async function getAllTeacher(req, res) {}

async function getAllStudentUnderSupervision(req, res) {}
async function getAllCurrentStudentUnderSupervision(req, res) {}

async function getAllTeamUnderSupervision(req, res) {}
async function getAllCurrentTeamUnderSupervision(req, res) {}

async function getAllStudentRequestedTeacher(req, res) {}
async function getAllTeamRequestedTeacher(req, res) {}

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
        const { userId } = req.user;

        await teacherService.updateTeacher(userId, teacher);

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

async function acceptStudentRequest(req, res) {}
async function rejectStudentRequest(req, res) {}

async function acceptTeamRequest(req, res) {}
async function rejectTeamRequest(req, res) {}

export default {
    createTeacher,
    getTeacher,
    getAllTeacher,
    getAllStudentUnderSupervision,
    getAllCurrentStudentUnderSupervision,
    getAllTeamUnderSupervision,
    getAllCurrentTeamUnderSupervision,
    getAllStudentRequestedTeacher,
    getAllTeamRequestedTeacher,
    acceptStudentRequest,
    rejectStudentRequest,
    acceptTeamRequest,
    rejectTeamRequest,
    updateTeacher,
    deleteTeacher,
};
