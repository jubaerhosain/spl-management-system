import createError from "http-errors";
import { models, sequelize, Op } from "../database/db.js";
import { Response } from "../utilities/response-format-utilities.js";


async function createPresentation(req, res, next) {
    try {
        const { splId, splName, academicYear } = req.spl;

        const presentation = await models.Presentation.create({
            splId: splId,
        });

        res.json(
            Response.success(
                `Presentation-${
                    presentation.presentationNo
                } created successfully for ${splName.toUpperCase()}, ${academicYear}`
            )
        );
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function addPresentationEvaluator(req, res, next) {
    try {
        const { teachers } = req.body;
        const { splId } = req.spl;

        const presentationEvaluators = [];
        for (const evaluator of teachers) {
            presentationEvaluators.push({
                splId,
                teacherId: evaluator,
            });
        }

        await models.SPLEvaluator.bulkCreate(presentationEvaluators);

        res.json(Response.success("Presentation evaluator added successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function removePresentationEvaluator(req, res, next) {
    try {
        const { splId, teacherId } = req.params;

        // remove the evaluator
        await models.SPLEvaluator.destroy({
            where: {
                splId,
                teacherId,
            },
        });

        res.json(Response.success("Presentation evaluator remove successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

export { createPresentation, addPresentationEvaluator, removePresentationEvaluator };
