import { models } from "../configs/mysql.js";
import Project from "../models/Project.js";

async function findAllProjectOfStudent(studentId, options) {
    const studentProjects = await models.ProjectContributor.findAll({where: {studentId}, raw: true});
    if(studentProjects.length == 0) return [];
    const projectIds = studentProjects.map((project) => project.projectId);
    
}

async function findCurrentProgressOfStudent(studentId, splId) {
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
    findAllProjectOfStudent,
    findCurrentProgressOfStudent,
};
