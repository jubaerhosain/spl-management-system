import { GenericResponse } from "../utils/responseUtils.js";
import presentationService from "../services/presentationService.js";
import CustomError from "../utils/CustomError.js";
import Joi from "../utils/validator/Joi.js";
import utils from "../utils/utils.js";

async function createPresentation(req, res) {
    try {
        const schema = Joi.object({
            splId: Joi.string().trim().uuid().required(),
            presentationNo: Joi.number().required(),
            eventDate: Joi.date().iso().required(),
            details: Joi.string().trim().optional(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        await presentationService.createPresentation(req.body);

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

async function getPresentation(req, res) {
    try {
        const schema = Joi.object({
            spl: Joi.boolean().optional(),
            evaluator: Joi.boolean().optional(),
        });
        const { error } = schema.validate(req.query);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const { presentationId } = req.params;
        const options = req.query;
        const presentation = await presentationService.getPresentation(presentationId, options);

        res.json(GenericResponse.success("Presentation retrieved successfully", presentation));
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
        await presentationService.addPresentationMark("bddd43e6-3dee-44f2-81ca-fedaaa17b477", presentationId);

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

async function getAllPresentationMark(req, res) {
    try {
        const schema = Joi.object({
            forEvaluator: Joi.boolean().optional(),
        });
        const { error } = schema.validate(req.query);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const userId = req.user?.userId;
        const { presentationId } = req.params;
        const options = req.query;
        const marks = await presentationService.getAllPresentationMark(
            "bddd43e6-3dee-44f2-81ca-fedaaa17b477",
            presentationId,
            options
        );

        res.json(GenericResponse.success("Presentation mark retrieved successfully", marks));
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
                        mark: Joi.number().required(),
                    })
                )
                .required(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const userId = req.user?.userId;
        const { presentationId } = req.params;
        const { marks } = req.body;
        await presentationService.updatePresentationMark("bddd43e6-3dee-44f2-81ca-fedaaa17b477", presentationId, marks);

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

async function addPresentationEvaluator(req, res) {
    try {
        const schema = Joi.object({
            evaluators: Joi.array()
                .min(1)
                .items(
                    Joi.object({
                        email: Joi.string().trim().email().required(),
                    })
                )
                .required(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const { evaluators } = req.body;
        const validateDuplicate = (evaluators) => {
            const emails = evaluators.map((evaluator) => evaluator.email);
            const error = {};
            evaluators.forEach((evaluator, index) => {
                if (utils.countOccurrences(emails, evaluator.email) > 1) {
                    error[`evaluators[${index}].email`] = {
                        msg: "duplicate email not allowed",
                        value: evaluator.email,
                    };
                }
            });

            if (utils.isObjectEmpty(error)) return null;
            return error;
        };

        const err = validateDuplicate(evaluators);
        if (err) return res.status(400).json(GenericResponse.error("Duplicate emails are not allowed", err));

        const { presentationId } = req.params;
        await presentationService.addPresentationEvaluator(presentationId, evaluators);

        res.json(GenericResponse.success("Presentation evaluator added successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function removePresentationEvaluator(req, res) {
    try {
        const { presentationId, evaluatorId } = req.params;

        await presentationService.removePresentationEvaluator(presentationId, evaluatorId);

        res.json(GenericResponse.success("Presentation evaluator removed successfully"));
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
    createPresentation,
    getPresentation,
    addPresentationMark,
    getAllPresentationMark,
    updatePresentationMark,
    addPresentationEvaluator,
    removePresentationEvaluator,
};
