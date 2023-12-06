import { models, Op, sequelize } from "../configs/mysql.js";

async function createSPL(spl) {
    await models.SPL.create(spl);
}

async function createMembers(newMembers) {
    await models.TeacherSPL_CommitteeMember.bulkCreate(newMembers);
}

async function isSupervisorRandomized(splId) {
    const studentSupervisor = await models.StudentTeacher_Supervisor.findAll({ where: { splId } });
    return studentSupervisor.length > 0;
}

async function createMultipleSupervisor(splId, teacherStudentIds) {
    const splStudentTeacher = teacherStudentIds.map((element) => {
        element.splId = splId;
        return element;
    });

    await models.StudentTeacher_Supervisor.bulkCreate(splStudentTeacher);
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

async function assignStudents(splId, studentIds) {
    const studentId_splId = [];
    for (const studentId of studentIds) {
        studentId_splId.push({
            splId,
            studentId,
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

async function findCurrentActiveSPL(studentId) {
    const spl = await models.Student.findOne({
        include: [
            {
                model: models.SPL,
                through: {
                    model: models.StudentSPL,
                    attributes: [],
                },
                where: {
                    active: true,
                },
                required: true,
            },
        ],
        where: {
            studentId,
        },
        attributes: ["studentId"],
        raw: true,
        nest: true,
    });

    if (!spl) return null;

    const currentSPL = { ...spl.SPLs };

    return currentSPL;
}

async function deleteSPL(splId) {}

export default {
    createSPL,
    createMembers,
    isSupervisorRandomized,
    createMultipleSupervisor,
    assignStudents,
    findById,
    findSplWithCommitteeDetail,
    findAllMemberId,
    findSPLByNameAndYear,
    findCurrentActiveSPL,
    removeStudentFromSPL,
    updateSPL,
    deleteSPL,
};
