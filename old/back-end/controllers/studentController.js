import { GenericResponse } from "../utils/responseUtils.js";
import studentService from "../services/studentService.js";
import CustomError from "../utils/CustomError.js";
import studentValidator from "../validators/studentValidator.js";
import utils from "../utils/utils.js";
import Joi from "joi";

async function getCurrentSupervisor(req, res) {}

async function getAllSupervisor(req, res) {}

async function getAllTeam(req, res) {}
async function getCurrentTeam(req, res) {}

async function requestTeacher(req, res) {
    try {
        
        const schema = oi.object({
            teacherId: Joi.string().uuid().required(),
        });
        
        const {error} = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("invalid data", error));
        
        const studentId = req.user.userId;
        const {teacherId} = req.body;
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

async function getAllRequest(req, res) {}
async function deleteRequest(req, res) {}

async function getAllSPLMark(req, res) {}
async function getSPLMark(req, res) {}

export default {
    getCurrentSupervisor,
    getAllSupervisor,
    getAllTeam,
    getCurrentTeam,
    requestTeacher,
    getAllRequest,
    getAllSPLMark,
    getSPLMark,
    deleteRequest,
};
