import { Response } from "../utilities/response-format-utilities.js";
import { models, Op } from "../database/db.js";
import { getCurriculumYear } from "../utilities/spl-utilities.js";

/**
 * Reads splName from req.params \
 * Puts spl to the req.body.spl
 */
async function checkSPLActivenessByName(req, res, next) {
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
            res.status(400).json(Response.error(`Theres is not active ${splName.toUpperCase()}`));
            return;
        }

        // put the spl into the req.body
        req.body.spl = spl;

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR));
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
        res.status(500).json(Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR));
    }
}

export { checkSPLActivenessByName, checkSPLManager };
