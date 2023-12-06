import { GenericResponse } from "../utils/responseUtils.js";
import teacherService from "../services/teacherService.js";
import CustomError from "../utils/CustomError.js";
import teacherValidator from "../validators/teacherValidator.js";

async function createTeacher(req, res) {
    try {
        const { teachers } = req.body;

        if (!teachers || teachers.length === 0)
            return res.status(400).json(GenericResponse.error("At least one teacher information must be provided"));

        const { error } = teacherValidator.createTeacherSchema.validate(teachers);
        if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

        const error1 = teacherValidator.validateCreateTeacherDuplicates(teachers);
        if (error1) return res.status(400).json(GenericResponse.error("duplicate emails are not allowed", error1));

        const error2 = await teacherValidator.validateCreateTeacherExistence(teachers);
        if (error2) return res.status(400).json(GenericResponse.error("existed emails are not allowed", error2));

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
