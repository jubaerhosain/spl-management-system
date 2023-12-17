import { GenericResponse } from "../utils/responseUtils.js";
import teamService from "../services/teamService.js";
import CustomError from "../utils/CustomError.js";
import utils from "../utils/utils.js";
import Joi from "../utils/validator/Joi.js";

async function createTeam(req, res) {
    try {
        const schema = Joi.object({
            splId: Joi.string().trim().uuid().required(),
            teams: Joi.array()
                .min(1)
                .items(
                    Joi.object({
                        teamName: Joi.string().trim().min(4).required(),
                        teamMembers: Joi.array().min(1).items({
                            email: Joi.string().trim().email().required(),
                        }),
                        details: Joi.string().trim().optional(),
                    })
                )
                .required(),
        }).required();

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const validateTeamMemberEmailDuplicates = (teams) => {
            const error = {};
            const emails = [];
            teams.forEach((team) => {
                team.teamMembers.forEach((member) => {
                    emails.push(member.email);
                });
            });

            teams.forEach((team, teamIndex) => {
                team.teamMembers.forEach((member, memberIndex) => {
                    if (utils.countOccurrences(emails, member.email) > 1) {
                        if (!error[`teams[${teamIndex}].teamMembers[${memberIndex}].email`]) {
                            error[`teams[${teamIndex}].teamMembers[${memberIndex}].email`] = {
                                msg: "duplicate email not allowed",
                                value: member.email,
                            };
                        }
                    }
                });
            });

            if (Object.keys(error).length === 0) return null;

            return error;
        };

        const error1 = validateTeamMemberEmailDuplicates(req.body.teams);
        if (error1) return res.status(400).json(GenericResponse.error("Validation failed", error1));

        await teamService.createTeam(req.body);

        return res.json(GenericResponse.success("Teams are created successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred while creating team"));
        }
    }
}

async function getAllTeam(req, res) {
    // Logic to get all teams
}

async function getTeam(req, res) {
    // Logic to get a specific team by teamId
}

async function updateTeam(req, res) {
    // Logic to update a team
}

async function deleteTeam(req, res) {
    // Logic to delete a team by teamId
}

async function getAllTeamMember(req, res) {
    // Logic to get all members of a team
}

async function addTeamMember(req, res) {
    // Logic to add a member to a team
}

async function removeTeamMember(req, res) {
    // Logic to delete a team member by memberId
}

async function requestTeacher(req, res) {
    try {
        const schema = Joi.object({
            teacherId: Joi.string().trim().uuid().required(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        await teamService.requestTeacher(teamId, teacherId);

        res.json(GenericResponse.success("Supervisor request send successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function getAllRequest(req, res) {
    // Logic to get all requests for a team
}

async function deleteRequest(req, res) {
    // Logic to delete a request for a team
}

async function assignSupervisor(req, res) {
    try {
        const schema = Joi.object({
            teacherEmail: Joi.string().trim().email().required(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const { teamId } = req.params;
        const { teacherEmail } = req.body;
        await teamService.assignSupervisor(teamId, teacherEmail);

        return res.json(GenericResponse.success("Supervisor assigned successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

export default {
    createTeam,
    updateTeam,
    getAllTeam,
    getTeam,
    deleteTeam,
    requestTeacher,
    addTeamMember,
    getAllTeamMember,
    getAllRequest,
    deleteRequest,
    removeTeamMember,
    assignSupervisor,
};
