import { Response } from "../utils/responseUtils.js";

async function createPresentationEvent(req, res) {
    try {
        const { splId } = req.query;

        const presentation = await models.Presentation.create({
            splId: splId,
        });

        res.json(Response.success(`Presentation event created successfully`));
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

export default { createPresentationEvent, addPresentationEvaluator, removePresentationEvaluator };
