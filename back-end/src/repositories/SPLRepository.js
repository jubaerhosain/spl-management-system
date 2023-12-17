import { models, Op, sequelize } from "../configs/mysql.js";

async function create(spl) {
    await models.SPL.create(spl);
}

async function isSupervisorRandomized(splId) {
    const studentSupervisor = await models.Supervisor.findAll({ where: { splId } });
    return studentSupervisor.length > 0;
}

async function findById(splId) {
    const spl = await models.SPL.findByPk(splId, {
        raw: true,
    });
    return spl;
}

async function findAll(options) {
    const splOptions = {};
    if (options?.active) splOptions.active = 1;
    if (options?.splName) splOptions.splName = options.splName;
    if (options?.academicYear) splOptions.academicYear = options.academicYear;

    const spls = await models.SPL.findAll({
        where: splOptions,
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

    const includeSPL = {
        model: models.SPL,
        where: splOptions,
        through: {
            model: models.StudentSPL_Enrollment,
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

    const spls = await models.Student.findAll({
        include: includeSupervisor ? [includeSPL, includeSupervisor] : includeSPL,
        raw: true,
        nest: true,
        attributes: [],
        where: { studentId },
    });

    if (!spls || spls.length == 0) return [];

    return spls.map((spl) => {
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
    });
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
};
