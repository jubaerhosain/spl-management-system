import { GenericResponse } from "../utils/responseUtils.js";
import splService from "../services/splService.js";
import CustomError from "../utils/CustomError.js";
import Joi from "../utils/validator/Joi.js";
import {
    validateSPLName,
    validateAcademicYear,
    validateCurriculumYear,
} from "../utils/validator/JoiValidationFunction.js";
import utils from "../utils/utils.js";

async function createSPL(req, res) {
    try {
        const schema = Joi.object({
            splName: Joi.string().trim().custom(validateSPLName).required(),
            academicYear: Joi.string().trim().custom(validateAcademicYear).required(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

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

async function getSPL(req, res) {
    try {
        const { splId } = req.params;

        const spl = await splService.getSPL(splId);

        if (!spl) return res.status(400).json(GenericResponse.error("SPL does not exist"));

        res.json(GenericResponse.success("SPL retrieved successfully", spl));
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
            academicYear: Joi.string().trim().custom(validateAcademicYear).optional(),
        }).required();

        const options = req.query;
        const { error } = schema.validate(options);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const spls = await splService.getAllSPL(options);

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

async function getActiveSPL(req, res) {}

async function enrollStudent(req, res) {
    try {
        const { splId } = req.params;
        const schema = Joi.object({
            curriculumYear: Joi.string().trim().custom(validateCurriculumYear).required(),
            students: Joi.array()
                .min(1)
                .items(
                    Joi.object({
                        studentId: Joi.string().trim().uuid().required(),
                    })
                )
                .required(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const validateDuplicate = (students) => {
            const error = {};
            const studentIds = students.map((student) => student.studentId);
            students.forEach((student, index) => {
                if (utils.countOccurrences(studentIds, student.studentId) > 1) {
                    error[`students[${index}].studentId`] = {
                        msg: "duplicate studentId not allowed",
                        value: student.studentId,
                    };
                }
            });

            if (utils.isObjectEmpty(error)) return null;
            return error;
        };

        const { curriculumYear, students } = req.body;

        const err = validateDuplicate(students);
        if (err) return res.status(400).json(GenericResponse.error("Validation failed", err));

        await splService.enrollStudent(splId, curriculumYear, students);

        res.json(GenericResponse.success("student are enrolled successfully to the spl"));
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

        res.json(GenericResponse.success("Students retrieved successfully", students));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function getAllProjectUnderSPL(req, res) {
    try {
        const { splId } = req.params;
        const students = await splService.getAllProjectUnderSPL(splId);

        res.json(GenericResponse.success("Projects retrieved successfully", students));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function getAllPresentationUnderSPL(req, res) {
    try {
        const { splId } = req.params;
        const students = await splService.getAllPresentationUnderSPL(splId);

        res.json(GenericResponse.success("Presentations retrieved successfully", students));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function unenrollStudent(req, res) {}

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
    enrollStudent,
    unenrollStudent,
    getAllStudentUnderSPL,
    getAllProjectUnderSPL,
    getAllPresentationUnderSPL,
    randomizeSupervisor,
};
