import { models, Op, sequelize, Sequelize } from "../configs/mysql.js";

async function create(spl) {
    await models.SPL.create(spl);
}

async function isSupervisorRandomized(splId) {
    const studentSupervisor = await models.Supervisor.findAll({ where: { splId } });
    return studentSupervisor.length > 0;
}

async function findById(splId, options) {
    let includeManager = {};
    if (options?.splManager) {
        includeManager = {
            include: {
                model: models.Teacher,
                as: "SPLManager",
                include: {
                    model: models.User,
                },
                attributes: {
                    exclude: ["teacherId"],
                },
            },
        };
    }

    const spl = await models.SPL.findByPk(splId, {
        ...includeManager,
        raw: true,
        nest: true,
    });

    if (options?.splManager) {
        const user = spl.SPLManager.User;
        delete spl.SPLManager.User;
        spl.SPLManager = { ...user, ...spl.SPLManager };
    }

    return spl;
}

async function findAll(options) {
    const splOptions = {};
    if (options?.active) splOptions.active = 1;
    if (options?.splName) splOptions.splName = options.splName;
    if (options?.academicYear) splOptions.academicYear = options.academicYear;

    const spls = await models.SPL.findAll({
        where: splOptions,
        order: [["splName", "ASC"]],
    });
    return spls;
}

async function findSPLByNameAndYear(splName, academicYear) {
    const spl = await models.SPL.findOne({
        where: {
            splName,
            academicYear,
        },
    });
    return spl;
}

/**
 * Also create mark table for each student
 * @param {*} splId
 * @param {*} studentIds
 */
async function enrollStudent(splId, studentIds) {
    const transaction = await sequelize.transaction();

    try {
        const studentId_splId = studentIds.map((studentId) => ({
            splId,
            studentId,
        }));

        await models.StudentSPL_Enrollment.bulkCreate(studentId_splId, { transaction });

        await models.SPLMark.bulkCreate(studentId_splId, { transaction });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        throw new Error("An error occurred while assigning to the spl");
    }
}

async function removeStudentFromSPL(splId, studentId) {
    await models.StudentSPL.destroy({
        where: {
            splId,
            studentId,
        },
    });
}

async function update(splId, spl) {
    await models.SPL.update(spl, { where: { splId } });
}

async function remove(splId) {}

async function findCurrentSPLOfStudent(studentId, options) {
    const includeSPL = {
        model: models.SPL,
        where: {
            active: true,
        },
        through: {
            model: models.StudentSPL,
            attributes: [],
        },
    };

    let includeSupervisor = null;
    if (options?.supervisor) {
        includeSupervisor = {
            model: models.Teacher,
            as: "Supervisors",
            include: {
                model: models.User,
            },
            through: {
                model: models.StudentSPL_Enrollment,
                attributes: [],
            },
            attributes: {
                exclude: ["teacherId"],
            },
        };
    }

    const spl = await models.Student.findOne({
        include: includeSupervisor ? [includeSPL, includeSupervisor] : includeSPL,
        raw: true,
        nest: true,
        attributes: [],
        where: { studentId },
    });

    if (!spl) return null;

    if (!includeSupervisor) return spl.SPLs;

    const tmpSpl = spl.SPLs;
    const supervisor = spl.Supervisors;
    let user = supervisor.User;
    delete supervisor.User;
    user = {
        ...user,
        ...supervisor,
    };

    return {
        ...tmpSpl,
        Supervisor: user,
    };
}

async function findAllSPLOfStudent(studentId, options) {
    const splOptions = {};
    if (options?.active) splOptions.active = 1;
    if (options?.splName) splOptions.splName = options.splName;

    const includes = [
        {
            model: models.SPL,
            where: splOptions,
            through: {
                model: models.StudentSPL_Enrollment,
                attributes: [],
            },
            order: [["splName", "ASC"]],
        },
    ];

    if (options?.supervisor) {
        const includeSupervisor = {
            model: models.Teacher,
            as: "Supervisors",
            include: {
                model: models.User,
            },
            through: {
                model: models.StudentTeacher_Supervisor,
                attributes: [],
            },
            attributes: {
                exclude: ["teacherId"],
            },
        };
        includes.push(includeSupervisor);
    }

    if (options?.project) {
        const includeProject = {
            model: models.Project,
            through: {
                model: models.ProjectStudent_Contributor,
                attributes: [],
            },
            where: {
                splId: {
                    [Op.eq]: Sequelize.literal("SPLs.splId"),
                },
            },
            required: false,
        };
        includes.push(includeProject);
    }

    const spls = await models.Student.findAll({
        include: includes,
        raw: true,
        nest: true,
        attributes: [],
        where: { studentId },
    });

    const result = [];
    spls.forEach((spl) => {
        if (options?.supervisor) {
            const teacher = spl.Supervisors;
            delete spl.Supervisors;
            let user = teacher.User;
            delete teacher.User;
            spl.Supervisor = {
                ...user,
                ...teacher,
            };
        }
        if (options?.project) {
            spl.Project = spl.Projects;
            delete spl.Projects;
        }

        const tempSPL = spl.SPLs;
        delete spl.SPLs;
        spl = { ...tempSPL, ...spl };
        result.push(spl);
    });

    return result;
}

async function isStudentBelongsToSPL(splId, studentId) {
    const belongs = await models.StudentSPL_Enrollment.findOne({ where: { studentId, splId }, raw: true });
    return belongs ? true : false;
}

export default {
    create,
    update,
    findById,
    findAll,
    remove,
    enrollStudent,
    findAllSPLOfStudent,
    findCurrentSPLOfStudent,
    findSPLByNameAndYear,
    // isSupervisorRandomized,
    // removeStudentFromSPL,

    // utility methods
    isStudentBelongsToSPL,
};
