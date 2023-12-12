import { models, Op, sequelize } from "../configs/mysql.js";

async function createSPL(spl) {
    await models.SPL.create(spl);
}

async function createMembers(newMembers) {
    await models.CommitteeMember.bulkCreate(newMembers);
}

async function isSupervisorRandomized(splId) {
    const studentSupervisor = await models.Supervisor.findAll({ where: { splId } });
    return studentSupervisor.length > 0;
}

async function createMultipleSupervisor(splId, teacherStudentIds) {
    const splStudentTeacher = teacherStudentIds.map((element) => {
        element.splId = splId;
        return element;
    });

    await models.Supervisor.bulkCreate(splStudentTeacher);
}

async function findById(splId) {
    const spl = await models.SPL.findByPk(splId, {
        raw: true,
    });

    return spl;
}

async function findSplWithCommitteeDetail(splId) {
    // include head, manger, committee member details
    const spl = await models.SPL.findByPk(splId, {
        raw: true,
    });

    return spl;
}

async function findAllMemberId(splId) {
    const members = await models.TeacherSPL_CommitteeMember.findAll({ where: { splId: splId } });
    if (members.length == 0) return [];
    return members.map((member) => member.teacherId);
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

async function updateSPL(splId, data) {
    await models.SPL.update(data, { where: { splId } });
}

async function deleteSPL(splId) {}

async function findAllSPLOfStudent(studentId, options) {
    const splOptions = {};
    // active: 'true' not works
    if (options?.active) splOptions.active = 1;

    const spls = await models.Student.findAll({
        include: {
            model: models.SPL,
            where: splOptions,
            through: {
                model: models.StudentSPL,
                attributes: [],
            },
            // required: true,
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
    findById,
    assignStudentAndCreateSPLMark,
    findAllSPLOfStudent,
    // findAllSPLOfStudentId,
    // createSPL,
    // createMembers,
    // isSupervisorRandomized,
    // createMultipleSupervisor,
    // findSplWithCommitteeDetail,
    // findAllMemberId,
    // findSPLByNameAndYear,
    // findCurrentActiveSPL,
    // removeStudentFromSPL,
    // updateSPL,
    // deleteSPL,
};
