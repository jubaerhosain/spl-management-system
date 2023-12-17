import { models, sequelize } from "../configs/mysql.js";

async function create(project, contributorIds) {
    const transaction = await sequelize.transaction();
    try {
        const newProject = await models.Project.create(project, { transaction });

        const contributors = [];
        contributorIds.forEach((studentId) => {
            contributors.push({
                projectId: newProject.teamId,
                studentId,
            });
        });

        await models.ProjectStudent_Contributor.bulkCreate(contributors, { transaction: t });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error("Transaction rolled back:", error);
        throw new Error("An error occurred while creating project");
    }
}

async function findById(projectId, options) {
    if (!options) {
        const project = await models.Project.findByPk(projectId, { raw: true });
        return project;
    }
    
    // options for including contributors
}

async function remove() {}
async function update() {}

async function findProjectOfStudent(studentId, splId) {
    // include contributors
}

async function findAllProjectOfStudent(studentId, options) {
    // include contributors
    const studentProjects = await models.ProjectContributor.findAll({ where: { studentId }, raw: true });
    if (studentProjects.length == 0) return [];
    const projectIds = studentProjects.map((project) => project.projectId);
}

async function findCurrentProgressOfStudent(studentId, splId) {
    // include project contributors
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

async function hasProject(studentId, splId) {
    // add attributes constraints
    const project = await models.Project.findOne({
        include: {
            model: models.Student,
            as: "ProjectContributors",
            through: {
                model: models.ProjectStudent_Contributor,
                attributes: [],
            },
            where: { studentId },
            required: true,
            attributes: [],
        },
        where: { splId },
        raw: true,
    });

    console.log("project repo, remove if any data has", project);

    return project ? true : false;
}

export default {
    create,
    remove,
    update,
    findAllProjectOfStudent,
    findCurrentProgressOfStudent,

    // utility methods
    hasProject,
};
