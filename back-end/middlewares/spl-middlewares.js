import { Response } from "../utilities/response-format-utilities.js";
import { models, Op } from "../database/db.js";
import { getCurriculumYear } from "../utilities/spl-utilities.js";

async function checkCreateSPL(req, res, next) {
    try {
        const { splName } = req.body;

        const spl = await models.SPL.findOne({
            where: {
                active: true,
                splName,
            },
            raw: true,
        });

        if (spl) {
            res.status(400).json(
                Response.error(`${splName.toUpperCase()} already active`, Response.SPL_EXIST)
            );
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
    }
}

async function checkAssignSPL(req, res, next) {
    try {
        const { splName } = req.params;

        const spl = await models.SPL.findOne({
            where: {
                splName: splName,
                active: true,
            },
            raw: true,
        });

        if (!spl) {
            res.status(400).json(Response.error(`There is no active ${splName.toUpperCase()}`));
            return;
        }
        req.spl = spl;

        const curriculumYear = getCurriculumYear(splName);

        const students = await models.Student.findAll({
            where: {
                curriculumYear,
            },
            raw: true,
            attributes: ["studentId"],
        });

        req.body.studentIds = students.map((student) => student.studentId);

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

/**
 * Reads splName from req.params \
 * Puts spl to the req.body.spl
 */
async function checkSPLActivenessByName(req, res, next) {
    try {
        const { splName } = req.body.spl;
        const spl = await models.SPL.findOne({
            where: {
                splName: splName,
                active: true,
            },
            raw: true,
        });

        if (!spl) {
            res.status(400).json(Response.error(`Theres is not active ${splName.toUpperCase()}`));
            return;
        }

        // put the spl into the req.body
        req.body.spl = spl;

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

// check if an teacher is splManager or not
async function checkSPLManager(req, res, next) {
    try {
        const { splName } = req.params;
        const { userId } = req.user;

        const spl = await models.SPL.findOne({
            where: {
                splName: splName,
                active: true,
                splManager: userId,
            },
            raw: true,
        });

        if (!spl) {
            res.status(404).json(Response.error("You are not allowed"));
        }

        req.spl = spl;

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

export { checkCreateSPL, checkAssignSPL, checkSPLActivenessByName, checkSPLManager };
