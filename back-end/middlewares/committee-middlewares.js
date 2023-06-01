import { Response } from "../utilities/response-format-utilities.js";
import { models, Op } from "../database/db.js";

/**
 * Checks if spl committee already created or not \
 * Reads spl from req.body.spl
 */
export async function checkSPLCommitteeCreated(req, res, next) {
    try {
        const { spl } = req.body;

        // check committeeHead or splManager exists or not
        if (spl.committeeHead || spl.splManager) {
            res.json(Response.success(`${spl.splName.toUpperCase()} committee already exists`));
            return;
        }

        // check member table [if head and manager removed then it should be checked]
        const committeeMembers = await models.TeacherSPL_CommitteeMember.findAll({
            where: {
                splId: spl.splId,
            },
            raw: true,
        });

        if (committeeMembers.length > 0) {
            res.json(Response.success(`${spl.splName.toUpperCase()} committee already exists`));
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
    }
}
