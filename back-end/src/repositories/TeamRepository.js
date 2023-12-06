import { models, Op } from "../database/db.js";

/**
 * Create one or more teams
 * @param {Array} teams
 */
async function createTeams(teams) {}

async function updateTeamName(teamId, teamName) {
    const team = {
        teamName: teamName,
    };
    await models.Team.update(team, {
        where: {
            teamId,
        },
    });
}

async function updateTeamDetails(teamId, details) {
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

export default {
    createTeams,
    updateTeamName,
    updateTeamDetails,
};
