import { GenericResponse } from "../utils/responseUtils.js";
import splService from "../services/splService.js";
import CustomError from "../utils/CustomError.js";
import Joi from "../utils/validator/Joi.js";
import { validateSPLName, validateAcademicYear } from "../utils/validator/JoiValidationFunction.js";

async function createSPL(req, res) {
    try {
        const schema = Joi.object({
            splName: Joi.string().trim().custom(validateSPLName).required(),
            academicYear: Joi.string().trim().custom(validateAcademicYear).required(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

        await splService.createSPL(req.body);

        res.json(GenericResponse.success("SPL created successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function updateSPL(req, res) {}

async function deleteSPL(req, res) {}

async function getSPL(req, res) {}
async function getAllSPL(req, res) {}
async function getActiveSPL(req, res) {}

async function assignStudentToSPL(req, res) {
    try {
        const { splId } = req.params;

        await splService.assignStudentsToSPL(splId);

        res.json(GenericResponse.success("student are assigned successfully to the spl"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function getAllStudentUnderSPL(req, res) {
    try {
        const { splId } = req.params;
        const students = await splService.getAllStudentUnderSPL(splId);

        res.json(GenericResponse.success("successfully get all students", students));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function removeStudentFromSPL(req, res) {}

async function randomizeSupervisor(req, res) {
    try {
        const { splId } = req.params;
        await splService.randomizeSupervisor(splId);

        res.json(GenericResponse.success("Assigned supervisor successfully for all students under spl"));
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
    createSPL,
    updateSPL,
    deleteSPL,
    getSPL,
    getAllSPL,
    getActiveSPL,
    assignStudentToSPL,
    removeStudentFromSPL,
    getAllStudentUnderSPL,
    randomizeSupervisor,
};
