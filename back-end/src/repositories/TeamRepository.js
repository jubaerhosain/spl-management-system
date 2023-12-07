import { models, sequelize, Op } from "../configs/mysql.js";

/**
 * Create one or more teams
 * @param {Array} teams
 */
async function createTeam(teams) {
    const transaction = await sequelize.transaction();
    try {
        await models.Team.bulkCreate(teams, {
            include: [{ model: models.TeamMember, as: "Members" }],
            transaction: transaction,
        });

        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        console.log(err);
        throw new Error(err.message);
    }
}

async function updateTeam(teamId, teamName) {
    /// edit
    const team1 = {
        teamName: teamName,
    };
    await models.Team.update(team, {
        where: {
            teamId,
        },
    });

    const team = {
        details: details,
    };
    await models.Team.update(team, {
        where: {
            teamId,
        },
    });
}

async function addTeamMember() {}

async function removeTeamMember(teamId) {}

async function findAllTeamUnderSPL(splId) {
    // with team members also
}

async function findAllTeamMemberUnderSPL(splId) {
    const students = await models.Student.findAll({
        include: [
            {
                model: models.User,
                where: {
                    active: true,
                },
                required: true,
            },
            {
                model: models.Team,
                through: {
                    model: models.TeamMember,
                    attributes: [],
                },
                where: {
                    splId: splId,
                },
                required: true,
            },
        ],
        raw: true,
        nest: true,
    });

    if (students.length == 0) return [];

    const flattened = [];
    students.forEach((student) => {
        const temp = {
            ...student,
            ...student.User,
        };
        delete temp.User;
        delete temp.Teams;
        flattened.push(temp);
    });

    return flattened;
}

export default {
    createTeam,
    updateTeam,
    findAllTeamUnderSPL,
    findAllTeamMemberUnderSPL,
};
