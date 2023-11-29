import { models, sequelize } from "../config/mysql.js";

async function createSPL(spl) {
    await models.SPL.create(spl);
}

async function createMembers(newMembers) {
    await models.TeacherSPL_CommitteeMember.bulkCreate(newMembers);
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
    const members = await models.TeacherSPL_CommitteeMember.findAll({ where: { splId } });
    if (members.length == 0) return [];
    return members.map((member) => member.teacherId);
}

async function findSPLByNameAndYear(splName, curriculumYear) {
    const spl = await models.SPL.findOne({
        where: {
            splName,
        },
    });
    return spl;
}

async function findAllActiveSPL() {}

async function assignStudents(splId, studentIds) {
    const studentId_splId = [];
    for (const studentId of studentIds) {
        studentId_splId.push({
            studentId,
            splId,
        });
    }

    await models.StudentSPL.bulkCreate(studentId_splId);
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

export default {
    createSPL,
    createMembers,
    findById,
    findSplWithCommitteeDetail,
    findAllMemberId,
    findSPLByNameAndYear,
    removeStudentFromSPL,
    updateSPL,
    deleteSPL,
};
