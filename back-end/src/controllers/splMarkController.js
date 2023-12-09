import splMarkService from "../services/splMarkService.js";
import CustomError from "../utils/CustomError.js";
import { GenericResponse } from "../utils/responseUtils.js";
import Joi from "../configs/Joi.js";

async function getSupervisorMark(req, res) {}

async function updateSupervisorMark(req, res) {
    try {
        const schema = Joi.object({
            marks: Joi.array()
                .min(1)
                .items({
                    studentId: Joi.string().trim().uuid().required(),
                    supervisorMark: Joi.number().required(),
                })
                .required(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Invalid data", error));

        const { splId } = req.params;
        const userId = req.user?.userId;
        const { marks } = req.body;
        await splMarkService.updateSupervisorMark(userId, splId, marks);

        return res.json(GenericResponse.success("Mark updated successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function getCodingMark(req, res) {}

async function updateCodingMark(req, res) {
    try {
        const schema = Joi.object({
            marks: Joi.array()
                .min(1)
                .items({
                    studentId: Joi.string().trim().uuid().required(),
                    codingMark: Joi.number().required(),
                })
                .required(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Invalid data", error));

        const { splId } = req.params;
        const { marks } = req.body;
        await splMarkService.updateCodingMark(splId, marks);

        return res.json(GenericResponse.success("Mark updated successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function createContinuousClassWithMark(req, res) {
    try {
        const schema = Joi.object({
            classNo: Joi.number().integer().required(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Invalid data", error));

        const { splId } = req.params;
        const { classNo } = req.body;
        await splMarkService.createContinuousClassWithMark(splId, classNo);

        return res.json(GenericResponse.success("Class created successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function updateContinuousClassNo(req, res) {
    try {
        const schema = Joi.object({
            oldClassNo: Joi.number().integer().required(),
            newClassNo: Joi.number().integer().required(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Invalid data", error));

        const { splId } = req.params;
        const { oldClassNo, newClassNo } = req.body;
        await splMarkService.updateContinuousClassNo(splId, oldClassNo, newClassNo);

        return res.json(GenericResponse.success("Class number updated successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function updateContinuousMark(req, res) {
    try {
        const schema = Joi.object({
            classNo: Joi.number().integer().required(),
            marks: Joi.array().min(1).items({
                studentId: Joi.string().uuid().required(),
                mark: Joi.number().integer().required(),
            }),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Invalid data", error));

        const { splId } = req.params;
        const { oldClassNo, newClassNo } = req.body;
        await splMarkService.updateContinuousClassNo(splId, oldClassNo, newClassNo);

        return res.json(GenericResponse.success("Class number updated successfully"));
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
    updateSupervisorMark,
    updateCodingMark,
    createContinuousClassWithMark,
    updateContinuousMark,
};
