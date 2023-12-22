import { models, sequelize, Op } from "../configs/mysql.js";
import utils from "../utils/utils.js";

async function create(project, contributorIds) {
    const transaction = await sequelize.transaction();
    try {
        const newProject = await models.Project.create(project, { transaction });

        const contributors = [];
        contributorIds.forEach((studentId) => {
            contributors.push({
                projectId: newProject.projectId,
                studentId,
            });
        });

        await models.ProjectStudent_Contributor.bulkCreate(contributors, { transaction });

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
    const studentProjects = await models.ProjectStudent_Contributor.findAll({ where: { studentId }, raw: true });
    if (studentProjects.length == 0) return [];
    const projectIds = studentProjects.map((project) => project.projectId);

    // include all contributors
    const includes = [
        {
            model: models.Student,
            as: "ProjectContributors",
            include: {
                model: models.User,
            },
            through: {
                model: models.ProjectStudent_Contributor,
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

    const projects = await models.Project.findAll({
        include: includes,
        where: {
            projectId: {
                [Op.in]: projectIds,
            },
        },
        raw: true,
        nest: true,
    });

    /**
     *
     * @param {*} data.User
     */
    const normalizeUserInclude = (data) => {
        const user = data.User;
        delete data.User;
        return { ...user, ...data };
    };

     // merge projects
     let index = 1;
     const processed = {};
     const mergedProjects = [];
     projects.forEach((project) => {
         if (processed[project.projectId]) {
             const inx = processed[project.projectId];
             const projectContributors = normalizeUserInclude(project.ProjectContributors);
             delete project.ProjectContributors;
             mergedProjects[inx - 1].projectContributors.push(projectContributors);
         } else {
             processed[project.projectId] = index++;
             const student = normalizeUserInclude(project.ProjectContributors);
             delete project.ProjectContributors;
             project.projectContributors = [student];
             if (project.Supervisor) {
                 project.supervisor = normalizeUserInclude(project.Supervisor);
                 delete project.Supervisor;
                 if (utils.areAllKeysNull(project.supervisor)) delete project.supervisor;
             }
             if (project.SPL) {
                 project.spl = project.SPL;
                 delete project.SPL;
             }
 
             mergedProjects.push(project);
         }
     });
 
     return mergedProjects;

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

async function hasStudentProject(studentId, splId) {
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

async function hasTeamProject(teamId, splId) {
    const project = await models.Project.findOne({ where: { teamId, splId }, raw: true });
    return project ? true : false;
}

export default {
    create,
    remove,
    update,
    findAllProjectOfStudent,
    findCurrentProgressOfStudent,

    // utility methods
    hasStudentProject,
    hasTeamProject,
};
