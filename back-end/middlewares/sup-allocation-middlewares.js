import { Sequelize, models, Op } from "../database/db.js";
import { Response } from "../utilities/response-format-utilities.js";

async function checkRemoveSupervisor(req, res, next) {
    try {
        const { studentId, teacherId } = req.params;

        // check supervisor is valid or not
        const valid = await models.StudentSupervisor.findOne({
            where: {
                studentId,
                teacherId,
            },
        });

        if (!valid) {
            res.status(400).json(Response.error("Invalid student or supervisor"));
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal server error"));
    }
}

export { checkRemoveSupervisor };
