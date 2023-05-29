import createError from "http-errors";
import { models, Op, sequelize } from "../database/db.js";
import { Response } from "../utilities/response-format-utilities.js";
import lodash from "lodash";

/**
 * Creates a new team with members for corresponding spl
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function createTeam(req, res, next) {
    try {
        const { splId } = req.body.spl;
        const { retrievedMembers, teamName } = req.body;

        const memberIds = retrievedMembers.map((member) => member.userId);

        const transaction = await sequelize.transaction();
        try {
            // create team with spl id
            const team = await models.Team.create(
                {
                    splId: splId,
                    teamName,
                },
                {
                    transaction: transaction,
                }
            );

            await team.addTeamMembers(memberIds, {
                transaction: transaction,
            });

            transaction.commit();

            res.json(Response.success(`Team '${teamName}' created successfully`));
        } catch (err) {
            await transaction.rollback();
            console.log(err);
            const message = err.status ? err.message : "Internal server error";
            next(new createError(err.status || 500, message));
        }
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error";
        next(new createError(err.status || 500, message));
    }
}

async function updateTeam(req, res, next) {
    try {
        const { teamId } = req.params;
        const { teamName } = req.body;

        await models.Team.update(
            {
                teamName,
            },
            {
                where: {
                    teamId,
                },
            }
        );

        res.json({
            message: `Team updated successfully`,
        });
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error";
        next(new createError(err.status || 500, message));
    }
}

async function addTeamMember(req, res, next) {
    try {
        const { teamId } = req.params;
        const { members } = req.body;

        const teamMembers = [];
        for (let member of members) {
            teamMembers.push({
                teamId,
                studentId: member,
            });
        }

        await models.StudentTeam.bulkCreate(teamMembers);

        res.json({
            message: "Team member added successfully",
        });
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error";
        next(new createError(err.status || 500, message));
    }
}

async function removeTeamMember(req, res, next) {
    try {
        const { teamId, studentId } = req.params;

        await models.StudentTeam.destroy({
            where: {
                teamId,
                studentId,
            },
        });

        res.json({
            message: "Team member removed successfully",
        });
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error";
        next(new createError(err.status || 500, message));
    }
}

async function getRequestedTeams(req, res, next) {
    try {
        const { userId } = req.user;

        let teamIds = await models.TeamRequest.findAll({
            where: {
                teacherId: userId,
            },
            raw: true,
            attributes: ["teamId"],
        });
        teamIds = teamIds.map((team) => team.teamId);

        console.log(teamIds);

        const teams = await models.Team.findAll({
            include: {
                model: models.Student,
                as: "TeamMembers",
                through: {
                    model: models.StudentTeam,
                    attributes: [],
                },
                include: {
                    model: models.User,
                },
            },
            where: {
                teamId: {
                    [Op.in]: teamIds,
                },
            },
            raw: true,
            nest: true,
        });

        // console.log(teams);

        for (const inx in teams) {
            const teamMember = teams[inx].TeamMembers;
            const user = teams[inx].TeamMembers.User;
            teams[inx] = { ...teams[inx], ...teamMember, ...user };

            delete teams[inx].TeamMembers;
            delete teams[inx].User;
        }

        const uniqueTeamIds = lodash.uniq(teams.map((team) => team.teamId));

        // console.log(uniqueTeamIds);

        const newTeams = [];
        for (const id of uniqueTeamIds) {
            const team = {
                members: [],
            };

            for (const obj of teams) {
                if (obj.teamId === id) {
                    team.teamId = obj.teamId;
                    team.teamName = obj.teamName;
                    team.members.push(obj);
                }
            }

            newTeams.push(team);
        }

        res.json(Response.success("Successful", newTeams));
    } catch (error) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function getTeamByTeamMember(req, res, next) {
    try {
        const studentId = req.user.userId;
        let team = await models.Student.findOne({
            include: [
                {
                    model: models.Team,
                    through: {
                        model: models.StudentTeam,
                        attributes: [],
                    },
                },
            ],
            where: {
                studentId,
            },
            raw: true,
            nest: true,
        });

        const teamInfo = team.Teams;
        team = { ...team, ...teamInfo };
        delete team.Teams;

        console.log(team);

        res.json(Response.success("Team retrieved successfully", team));
    } catch (error) {
        console.log(error);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function getTeamsWithMembers(req, res, next) {
    try {
        const teams = await models.Team.findAll({
            include: {
                model: models.Student,
                as: "TeamMembers",
                through: {
                    model: models.StudentTeam,
                    attributes: [],
                },
                include: {
                    model: models.User,
                },
            },
            raw: true,
            nest: true,
        });

        for (const inx in teams) {
            const teamMember = teams[inx].TeamMembers;
            const user = teams[inx].TeamMembers.User;
            teams[inx] = { ...teams[inx], ...teamMember, ...user };

            delete teams[inx].TeamMembers;
            delete teams[inx].User;
        }

        const uniqueTeamIds = lodash.uniq(teams.map((team) => team.teamId));

        // console.log(uniqueTeamIds);

        const newTeams = [];
        for (const id of uniqueTeamIds) {
            const team = {
                members: [],
            };

            for (const obj of teams) {
                if (obj.teamId === id) {
                    team.teamId = obj.teamId;
                    team.teamName = obj.teamName;
                    team.members.push(obj);
                }
            }

            newTeams.push(team);
        }

        res.json(Response.success("Successful", newTeams));
    } catch (error) {
        console.log(error);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function getTeamInfoWithSuperVisor(req, res, next) {
    try {
        const teams = await models.Team.findAll({
            include: {
                model: models.Student,
                as: "TeamMembers",
                through: {
                    model: models.StudentTeam,
                    attributes: [],
                },
                include: [{
                    model: models.User,
                },
                {
                    model: models.Teacher,
                    as: "Supervisors",
                    through: {
                        model: models.StudentSupervisor,
                        attributes: []
                    },
                    include: {
                        model: models.User
                    }
                }],
            },
            raw: true,
            nest: true,
        });

        console.log(teams);

        for (const inx in teams) {
            const teamMember = teams[inx].TeamMembers;
            const user = teams[inx].TeamMembers.User;
            const supervisorName = teams[inx].TeamMembers.Supervisors.User.name;
            teams[inx] = { ...teams[inx], ...teamMember, ...user };
            teams[inx].supervisorName = supervisorName;

            delete teams[inx].TeamMembers;
            delete teams[inx].User;
            delete teams[inx].Supervisors;
        }

        const uniqueTeamIds = lodash.uniq(teams.map((team) => team.teamId));

        // console.log(uniqueTeamIds);

        const newTeams = [];
        for (const id of uniqueTeamIds) {
            const team = {
                members: [],
            };

            for (const obj of teams) {
                if (obj.teamId === id) {
                    team.teamId = obj.teamId;
                    team.teamName = obj.teamName;
                    team.supervisorName = obj.supervisorName;
                    team.members.push(obj);
                }
            }

            newTeams.push(team);
        }

        res.json(Response.success("Successful", newTeams));
    } catch (error) {
        console.log(error);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

export {
    createTeam,
    updateTeam,
    addTeamMember,
    removeTeamMember,
    getRequestedTeams,
    getTeamByTeamMember,
    getTeamsWithMembers,
    getTeamInfoWithSuperVisor
};
