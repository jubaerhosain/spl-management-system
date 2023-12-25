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
    });

    if (projects.length == 0) return [];

    const result = [];
    projects.forEach((project) => {
        let newProject = {};
        const ProjectContributors = project.ProjectContributors.map((student) => {
            const user = student.User.dataValues;
            delete student.dataValues.User;
            return { ...user, ...student.dataValues };
        });
        delete project.dataValues.ProjectContributors;
        newProject.ProjectContributors = ProjectContributors;

        if (project.Supervisor) {
            const teacher = project.Supervisor.dataValues;
            const user = teacher.User.dataValues;
            delete delete teacher.User;
            newProject.Supervisor = { ...user, ...teacher };
            delete project.dataValues.Supervisor;
        }

        if (project.SPL) {
            newProject.SPL = project.SPL;
            delete project.dataValues.SPL;
        }

        newProject = { ...project.dataValues, ...newProject };

        result.push(newProject);
    });

    return result;
}

async function findCurrentProjectOfStudent(studentId, splId, options) {
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
            splId,
        },
        raw: true,
        nest: true,
        attributes: {
            exclude: options?.progress ? [] : ["documentationProgress", "codeProgress", "weeklyProgress"],
        },
    });

    if (projects.length == 0) return null;

    /**
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

    return mergedProjects[0];
}

async function findAllProjectUnderSupervisor(supervisorId, options) {
    // always include spl
    const includeSPL = {
        model: models.SPL,
        required: true,
        where: {},
    };

    if (options?.splName) includeSPL.where.splName = options.splName;
    if (options?.active) includeSPL.where.active = true;
    if (options?.academicYear) includeSPL.where.academicYear = options.academicYear;

    const projects = await models.Project.findAll({
        include: [
            {
                model: models.Student,
                as: "ProjectContributors",
                include: { model: models.User },
                through: {
                    model: models.ProjectStudent_Contributor,
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
    projects.forEach((project) => {
        const newProject = project.dataValues;

        const ProjectContributors = newProject.ProjectContributors.map((student) => {
            const newStudent = student.dataValues;
            const user = newStudent.User.dataValues;
            delete newStudent.User;
            return { ...user, ...newStudent };
        });
        newProject.ProjectContributors = ProjectContributors;

        const SPL = newProject.SPL.dataValues;
        delete newProject.SPLs;
        result.push({ ...newProject, SPL });
    });

    return result;
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
    findCurrentProjectOfStudent,
    findAllProjectUnderSupervisor,

    // utility methods
    hasStudentProject,
    hasTeamProject,
};
