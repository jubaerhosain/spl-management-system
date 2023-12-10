import { GenericResponse } from "../utils/responseUtils.js";
import presentationService from "../services/presentationService.js";
import CustomError from "../utils/CustomError.js";
import Joi from "../utils/validator/Joi.js";

async function createPresentationEvent(req, res) {
    try {
        const schema = Joi.object({
            splId: Joi.string().trim().uuid().required(),
            presentationNo: Joi.number().required(),
            details: Joi.string().trim().optional(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        await presentationService.createPresentationEvent(req.body);

        res.json(GenericResponse.success("Presentation event created successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function updatePresentation(req, res) {}

async function addPresentationMark(req, res) {
    try {
        const userId = req.user?.userId;
        const { presentationId } = req.params;
        await presentationService.addPresentationMark("0175f873-25c0-4fe0-9969-c7737c6bb7b3", presentationId);

        res.json(GenericResponse.success("Presentation mark added successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function updatePresentationMark(req, res) {
    try {
        const schema = Joi.object({
            marks: Joi.array()
                .min(1)
                .items(
                    Joi.object({
                        presentationMarkId: Joi.string().trim().uuid().required(),
                        presentationId: Joi.string().trim().uuid().required(),
                        studentId: Joi.string().trim().uuid().required(),
                        teacherId: Joi.string().trim().uuid().required(),
                        mark: Joi.number().required(),
                    })
                )
                .required(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const userId = req.user?.userId;
        const { presentationId } = req.params;
        const {marks} = req.body;
        await presentationService.updatePresentationMark("0175f873-25c0-4fe0-9969-c7737c6bb7b3", presentationId, marks);

        res.json(GenericResponse.success("Presentation mark updated successfully"));
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
    createPresentationEvent,
    addPresentationMark,
    updatePresentationMark,
};
