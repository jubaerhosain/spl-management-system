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

    // options for teamMembers....
}

async function update(teamId, team) {
    await models.Team.update(team, {
        where: {
            teamId,
        },
    });
}

async function addTeamMember() {}

async function findAllTeamMember(teamId) {
    let members = await models.Student.findAll({
        include: [
            {
                model: models.User,
            },
            {
                model: models.Team,
                through: {
                    model: models.TeamStudent_Member,
                    attributes: [],
                },
                where: { teamId },
                attributes: [],
            },
        ],
        attributes: {
            exclude: ["studentId"],
        },
        raw: true,
        nest: true,
    });

    members = members.map((student) => {
        const user = student.User;
        delete student.User;
        return { ...user, ...student };
    });

    return members || [];
}

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

async function findAllTeamOfStudent(studentId, options) {
    const studentTeams = await models.TeamStudent_Member.findAll({ where: { studentId } });
    if (studentTeams.length == 0) return [];
    const teamIds = studentTeams.map((studentTeam) => studentTeam.teamId);

    // include all team members
    const includes = [
        {
            model: models.Student,
            as: "TeamMembers",
            include: {
                model: models.User,
            },
            through: {
                model: models.TeamStudent_Member,
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

    // console.log(teams);
    // return teams;

    /**
     *
     * @param {*} data.User
     */
    const normalizeUserInclude = (data) => {
        const user = data.User;
        delete data.User;
        return { ...user, ...data };
    };

    // merge teams
    let index = 1;
    const processed = {};
    const mergedTeams = [];
    teams.forEach((team) => {
        if (processed[team.teamId]) {
            const inx = processed[team.teamId];
            const teamMembers = normalizeUserInclude(team.TeamMembers);
            delete team.TeamMembers;
            mergedTeams[inx - 1].teamMembers.push(teamMembers);
        } else {
            processed[team.teamId] = index++;
            const student = normalizeUserInclude(team.TeamMembers);
            delete team.TeamMembers;
            team.teamMembers = [student];
            if (team.Supervisor) {
                team.supervisor = normalizeUserInclude(team.Supervisor);
                delete team.Supervisor;
                if (utils.areAllKeysNull(team.supervisor)) delete team.supervisor;
            }
            if(team.SPL) {
                team.spl = team.SPL;
                delete team.SPL;
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

async function isSupervisorExist(teamId) {
    const team = await models.Team.findByPk(teamId, { raw: true });
    return team.teacherId ? true : false;
}

/**
 * Also add supervisor for individual team members
 * @param {*} teamId
 * @param {*} supervisorId
 * @param {*} splId
 * @param {Array} teamMemberIds
 */
async function addSupervisor(teamId, supervisorId, splId, teamMemberIds) {
    const transaction = await sequelize.transaction();
    try {
        await models.Team.update({ supervisorId }, { where: { teamId } }, { transaction });

        const studentTeacher = teamMemberIds.map((studentId) => {
            return { splId, studentId, teacherId: supervisorId };
        });

        await models.StudentTeacher_Supervisor.bulkCreate(studentTeacher, { transaction });

        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        console.log(err);
        throw new Error("An error occurred while adding a supervisor");
    }
}

export default {
    create,
    findById,
    update,
    findAllTeamMember,
    // findAllTeamUnderSPL, // with team members
    findAllTeamOfStudent,
    findCurrentTeamOfStudent,
    // findAllTeamMemberUnderSPL,
    addSupervisor,

    // utility methods
    findAllTeamMemberEmailUnderSPL,
    isSupervisorExist,
};
