import { models, Op, sequelize } from "../configs/mysql.js";

async function create(spl) {
    await models.SPL.create(spl);
}

async function createMembers(newMembers) {
    await models.CommitteeMember.bulkCreate(newMembers);
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


async function findSPLByNameAndYear(splName, academicYear) {
    const spl = await models.SPL.findOne({
        where: {
            splName,
            academicYear,
        },
    });
    return spl;
}

async function findAllActiveSPL() {}

async function assignStudentAndCreateSPLMark(splId, studentIds) {
    const transaction = await sequelize.transaction();

    try {
        const studentId_splId = studentIds.map((studentId) => ({
            splId,
            studentId,
        }));

        await models.StudentSPL.bulkCreate(studentId_splId, { transaction });

        const splMarks = studentIds.map((studentId) => ({
            splId,
            studentId,
        }));
        await models.SPLMark.bulkCreate(splMarks, { transaction });

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

async function findCurrentSPLOfStudent(studentId) {
    const spl = await models.Student.findByPk(studentId, {
        include: {
            model: models.SPL,
            through: {
                model: models.StudentSPL,
                attributes: [],
            },
        },
        raw: true,
        nest: true,
        attributes: [],
    });
    if (!spl) return null;
    return spl.SPLs;
}

async function findAllSPLOfStudent(studentId) {
    const spls = await models.Student.findAll({
        include: {
            model: models.SPL,
            through: {
                model: models.StudentSPL,
                attributes: [],
            },
        },
        raw: true,
        nest: true,
        attributes: [],
        where: { studentId },
    });
    if (!spls) return [];
    return spls.map((spl) => spl.SPLs);
}

export default {
    create,
    update,
    findById,
    remove,
    assignStudentAndCreateSPLMark,
    findAllSPLOfStudent,
    findCurrentSPLOfStudent,
    // createMembers,
    // isSupervisorRandomized,
    // findSPLByNameAndYear,
    // findCurrentActiveSPL,
    // removeStudentFromSPL,
};
