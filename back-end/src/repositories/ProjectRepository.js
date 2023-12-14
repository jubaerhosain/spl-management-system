import { models } from "../configs/mysql.js";
import Project from "../models/Project.js";

async function findAllProjectsOfStudent(studentId, options) {}

async function findCurrentProgress(studentId, splId) {
    const project = await models.Project.findOne({
        include: [
            {
                model: models.Student,
                through: {
                    model: models.ProjectContributor,
                },
                required: true,
            },
            {
                model: models.SPL,
            },
        ],
        where: { splId },
        raw: true,
        nest: true,
    });

    if (!project) return null;

    const students = await models.Student.findAll({
        include: [
            {
                model: models.User,
            },
            {
                model: models.Project,
                through: {
                    model: models.ProjectContributor,
                    attributes: [],
                },
                where: { projectId: project.projectId },
            },
        ],
        attributes: {
            exclude: ["studentId"],
        },
    });
}

export default {
    findCurrentProgress,
};
