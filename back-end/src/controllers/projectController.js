import CustomError from "../utils/CustomError.js";
import Joi from "../utils/validator/Joi.js";
import { GenericResponse } from "../utils/responseUtils.js";
import projectService from "../services/projectService.js";

async function createProject(req, res) {
    try {
        const schema = Joi.object({
            splId: Joi.string().trim().uuid().required(),
            projectName: Joi.string().trim().required(),
            description: Joi.string().trim().required(),
            projectType: Joi.string().trim().valid("individual", "team").required(),
            teamId: Joi.when("projectType", {
                is: Joi.string().valid("team").required(),
                then: Joi.string().trim().uuid().required(),
                otherwise: Joi.string().trim().uuid().optional(),
            }),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation", error));

        const studentId = req.user?.userId ? req.user.userId : "2e9dd162-d495-4167-a66c-8aa96cba54db";
        await projectService.createProject(studentId, req.body);

        return res.json(GenericResponse.success("Project created successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}
async function getProject(req, res) {}
async function getAllProject(req, res) {}
async function updateProject(req, res) {}
async function deleteProject(req, res) {}

export default {
    createProject,
    getProject,
    getAllProject,
    updateProject,
    deleteProject,
};
