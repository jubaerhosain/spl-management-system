import { Response } from "../utilities/response-format-utilities.js";
import { models, Op } from "../database/db.js";
import { getCurriculumYear } from "../utilities/spl-utilities.js";

async function checkCreateTeam(req, res, next) {
    try {
        const { retrievedMembers, spl } = req.body;
        const { splId, splName } = spl;

        const memberIds = retrievedMembers.map((member) => member.userId);

        // check if any students are already members of another team of same spl

        // teams of current spl
        const teams = await models.Team.findAll({
            where: {
                splId: splId,
            },
            raw: true,
            attributes: ["teamId"],
        });

        // students who are members of any team of same spl
        const alreadyMembers = await models.StudentTeam.findAll({
            where: {
                studentId: {
                    [Op.in]: memberIds,
                },
                teamId: {
                    [Op.in]: teams.map((team) => team.teamId),
                },
            },
            raw: true,
            attributes: ["studentId"],
        });

        const existedMemberIds = alreadyMembers.map((member) => member.studentId);
        const existingEmails = [];
        for (const member of retrievedMembers) {
            if (existedMemberIds.includes(member.userId)) existingEmails.push(member.email);
        }

        // return the emails who are already members of another team of same spl

        if (existingEmails.length > 0) {
            const message = `Following students are already members of another team of ${splName.toUpperCase()}`;
            res.status(400).json(Response.error(message, existingEmails));
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

export { checkCreateTeam };
