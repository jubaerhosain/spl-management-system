import { GenericResponse } from "../utils/responseUtils.js";
import presentationValidator from "../validators/presentationValidator.js";
import presentationService from "../services/presentationService.js";
import CustomError from "../utils/CustomError.js";

async function createPresentationEvent(req, res) {
    try {
        const { error } = presentationValidator.createPresentationSchema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

        const {splId} = req.body
        delete req.body.splId;
        await presentationService.createPresentationEvent(splId, req.body);

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

export default {
    createPresentationEvent,
};
