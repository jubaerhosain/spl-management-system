import { Response } from "../utilities/response-format-utilities.js";
import { models, Op } from "../database/db.js";

async function checkCreateCommittee(req, res, next) {
    try {
        const { splName } = req.params;
        const headEmail = req.body.committeeHead;
        const memberEmails = req.body.committeeMembers;

        const spl = await models.SPL.findOne({
            where: {
                splName: splName,
                active: true,
            },
            raw: true,
            attributes: ["splId", "splName", "academicYear"],
        });

        if (!spl) {
            res.status(400).json(Response.error(`There is no active ${splName.toUpperCase()}`));
            return;
        }
        req.spl = spl;

        const committeeHead = await models.User.findOne({
            where: {
                active: true,
                userType: "teacher",
                email: headEmail,
            },
            attributes: ["userId"],
            raw: true,
        });

        if (!committeeHead) {
            res.status(400).json(Response.error("Committee Head email not found"));
            return;
        }
        req.body.committeeHeadId = committeeHead.userId;

        const committeeMembers = await models.User.findAll({
            where: {
                active: true,
                userType: "teacher",
                email: {
                    [Op.in]: memberEmails,
                },
            },
            attributes: ["userId"],
            raw: true,
        });

        if (committeeMembers.length != memberEmails.length) {
            res.status(400).json(Response.error("Committee Members email not found"));
            return;
        }
        req.body.committeeMemberIds = committeeMembers.map((member) => member.userId);

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

export { checkCreateCommittee };
