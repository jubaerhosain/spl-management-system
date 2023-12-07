import { GenericResponse } from "../utils/responseUtils.js";
import teamValidator from "../validators/teamValidator.js";
import teamService from "../services/teamService.js";
import CustomError from "../utils/CustomError.js";

async function createTeam(req, res) {
    try {
        const { error } = teamValidator.createTeamSchema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Invalid data", error));

        const error1 = teamValidator.validateTeamMemberEmailDuplicates(req.body.teams);
        if(error1) return res.status(400).json(GenericResponse.error("Invalid data", error1));

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
    // Logic to handle a teacher request for a team
}

async function getAllRequest(req, res) {
    // Logic to get all requests for a team
}

async function deleteRequest(req, res) {
    // Logic to delete a request for a team
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
};
