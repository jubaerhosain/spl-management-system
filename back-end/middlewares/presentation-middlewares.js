import { Sequelize, models, Op } from "../database/db.js";
import { Response } from "../utilities/response-format-utilities.js";
import { filterArray, clearArray, concatArray } from "../utilities/common-utilities.js";


async function checkCreatePresentation(req, res, next) {
    try {
        const { splName } = req.params;

        // check active spl
        const spl = await models.SPL.findOne({
            where: {
                splName: splName,
                active: true,
            },
            attributes: ["splId", "splName", "academicYear"],
            raw: true,
        });

        if (!spl) {
            res.status(400).json(Response.error(`There is no active ${splName.toUpperCase()}`));
            return;
        }

        // put spl to the req
        req.spl = spl;

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function checkAddPresentationEvaluator(req, res, next) {
    try {
        const { splName } = req.params;
        let evaluators = req.body.teachers;

        // check active spl
        const spl = await models.SPL.findOne({
            where: {
                splName: splName,
                active: true,
            },
            attributes: ["splId", "splName", "academicYear"],
            raw: true,
        });

        if (!spl) {
            res.status(400).json(Response.error(`There is no active ${splName.toUpperCase()}`));
            return;
        }

        // put spl to the req
        req.spl = spl;

        // check if the evaluators are valid teachers or not
        const teachers = await models.User.findAll({
            where: {
                userId: {
                    [Op.in]: evaluators,
                },
                active: true,
                userType: "teacher",
            },
            raw: true,
            attributes: ["userId"],
        });

        if (teachers.length !== evaluators.length) {
            res.status(400).json(Response.error("All evaluator must be teacher"));
            return;
        }

        // check already evaluators or not
        const { splId } = req.spl;

        const existedEvaluators = await models.SPLEvaluator.findAll({
            where: {
                splId,
                teacherId: {
                    [Op.in]: evaluators,
                },
            },
            raw: true,
        });

        // remove existing evaluators
        evaluators = filterArray(evaluators, existedEvaluators);

        if (evaluators.length == 0) {
            res.status(400).json(
                Response.error(`Teachers are already evaluator of ${splName.toUpperCase()}`)
            );
            return;
        }

        // put new evaluators to the teachers array
        clearArray(req.body.teachers);
        concatArray(req.body.teachers, evaluators);

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function checkRemovePresentationEvaluator(req, res, next) {
    try {
        const { splId, teacherId } = req.params;

        // check if splId and teacherId is valid or not
        const valid = await models.SPLEvaluator.findOne({
            where: {
                splId,
                teacherId,
            },
        });

        if (!valid) {
            res.status(400).json(Response.error("Invalid SPL or Teacher"));
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

export { checkCreatePresentation, checkAddPresentationEvaluator, checkRemovePresentationEvaluator };
