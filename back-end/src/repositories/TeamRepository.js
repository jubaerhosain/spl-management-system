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

    if (options?.project) {
        const includeProject = {
            model: models.Project,
        };
        includes.push(includeProject);
    }

    const teams = await models.Team.findAll({
        include: includes,
        where: {
            teamId: {
                [Op.in]: teamIds,
            },
        },
    });

    if (teams.length == 0) return [];

    const result = [];
    teams.forEach((team) => {
        let newTeam = {};
        const TeamMembers = team.TeamMembers.map((student) => {
            const user = student.User.dataValues;
            delete student.dataValues.User;
            return { ...user, ...student.dataValues };
        });
        delete team.dataValues.TeamMembers;
        newTeam.TeamMembers = TeamMembers;

        if (team.Supervisor) {
            const teacher = team.Supervisor.dataValues;
            const user = teacher.User.dataValues;
            delete delete teacher.User;
            newTeam.Supervisor = { ...user, ...teacher };
            delete team.dataValues.Supervisor;
        }

        if (team.SPL) {
            newTeam.SPL = team.SPL;
            delete team.dataValues.SPL;
        }

        if (team.Project) {
            newTeam.Project = team.Project;
            delete team.dataValues.Project;
        }

        newTeam = { ...team.dataValues, ...newTeam };

        result.push(newTeam);
    });

    return result;
}

async function findCurrentTeamOfStudent(studentId, splId) {
    // including team members
}

async function findAllTeamUnderSupervisor(supervisorId, options) {
    // always include spl
    const includeSPL = {
        model: models.SPL,
        required: true,
        where: {},
    };

    if (options?.splName) includeSPL.where.splName = options.splName;
    if (options?.active) includeSPL.where.active = true;
    if (options?.academicYear) includeSPL.where.academicYear = options.academicYear;

    const teams = await models.Team.findAll({
        include: [
            {
                model: models.Student,
                as: "TeamMembers",
                include: { model: models.User },
                through: {
                    model: models.TeamStudent_Member,
                    attributes: [],
                },
                attributes: {
                    exclude: ["studentId"],
                },
            },
            {
                model: models.Teacher,
                as: "Supervisor",
                required: true,
                where: {
                    teacherId: supervisorId,
                },
                attributes: [],
            },
            includeSPL,
        ],
    });

    const result = [];
    teams.forEach((team) => {
        const newTeam = team.dataValues;

        const TeamMembers = newTeam.TeamMembers.map((student) => {
            const newStudent = student.dataValues;
            const user = newStudent.User.dataValues;
            delete newStudent.User;
            return { ...user, ...newStudent };
        });
        newTeam.TeamMembers = TeamMembers;

        const SPL = newTeam.SPL.dataValues;
        delete newTeam.SPLs;
        result.push({ ...newTeam, SPL });
    });

    return result;
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
    findAllTeamUnderSupervisor,
    addSupervisor,

    // utility methods
    findAllTeamMemberEmailUnderSPL,
    isSupervisorExist,
};
