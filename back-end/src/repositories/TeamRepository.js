import { models, sequelize, Op } from "../configs/mysql.js";
import utils from "../utils/utils.js";

/**
 * Create one or more teams
 * @param {Array} teams
 */
async function create(teams) {
    const transaction = await sequelize.transaction();
    try {
        await models.Team.bulkCreate(teams, {
            include: [{ model: models.TeamStudent_Member, as: "Members" }],
            transaction: transaction,
        });

        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        console.log(err);
        throw new Error(err.message);
    }
}

async function findById(teamId, options) {
    if (!options) {
        const team = await models.Team.findByPk(teamId, { raw: true });
        return team;
    }
}

async function update(teamId, team) {
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

async function createTeamRequest(teamId, teacherId, splId) {}

async function findAllTeamOfStudent(studentId, options) {
    const studentTeams = await models.TeamStudent_Member.findAll({ where: { studentId } });
    if (studentTeams.length == 0) return [];
    const teamIds = studentTeams.map((studentTeam) => studentTeam.teamId);

    // include all team members
    const includes = [
        {
            model: models.Student,
            include: {
                model: models.User,
            },
            through: {
                model: models.TeamMember,
                attributes: [],
            },
            attributes: {
                exclude: ["studentId"],
            },
        },
    ];

    if (options?.supervisor) {
        const includeSupervisor = {
            model: models.Teacher,
            include: {
                model: models.User,
            },
            as: "Supervisor",
            attributes: {
                exclude: ["teacherId"],
            },
        };
        includes.push(includeSupervisor);
    }

    if (options?.spl) {
        const includeSPL = {
            model: models.SPL,
        };
        includes.push(includeSPL);
    }

    const teams = await models.Team.findAll({
        include: includes,
        where: {
            teamId: {
                [Op.in]: teamIds,
            },
        },
        raw: true,
        nest: true,
    });

    // merge teams
    let index = 1;
    const processed = {};
    const mergedTeams = [];
    teams.forEach((team) => {
        if (processed[team.teamId]) {
            const inx = processed[team.teamId];
            const student = utils.normalizeUserInclude(team.Students);
            delete team.Students;
            mergedTeams[inx - 1].teamMembers.push(student);
        } else {
            processed[team.teamId] = index++;
            const student = utils.normalizeUserInclude(team.Students);
            delete team.Students;
            team.teamMembers = [student];
            if (team.Supervisor) {
                team.Supervisor = utils.normalizeUserInclude(team.Supervisor);
                if (utils.areAllKeysNull(team.Supervisor)) delete team.Supervisor;
            }

            mergedTeams.push(team);
        }
    });

    return mergedTeams;
}

async function findCurrentTeamOfStudent(studentId, splId) {
    // including team members
}

async function findAllTeamMemberEmailUnderSPL(splId) {
    const students = await models.Student.findAll({
        include: [
            {
                model: models.User,
                where: {
                    active: true,
                },
                attributes: ["email"],
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
                attributes: [],
                required: true,
            },
        ],
        raw: true,
        nest: true,
        attributes: [],
    });

    if (students.length == 0) return [];

    return students.map((student) => {
        return student?.User?.email;
    });
}

export default {
    create,
    findById,
    update,
    // createTeamRequest, // move supervisor repository
    // findAllTeamUnderSPL, // with team members
    findAllTeamOfStudent,
    findCurrentTeamOfStudent,
    // findAllTeamMemberUnderSPL,

    // utility methods
    findAllTeamMemberEmailUnderSPL,
};
