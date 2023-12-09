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
        });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

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

async function updatePresentation() {}

export default {
    createPresentationEvent,
};
