import { models, sequelize } from "../config/mysql.js";

async function create(committee) {
    const memberIds = committee.memberIds;
    delete committee.memberIds;

    const transaction = await sequelize.transaction();
    try {
        const spl = await models.SPL.create(committee, { transaction });

        const teacherId_splId = memberIds.map((teacherId) => {
            return {
                splId: spl.splId,
                teacherId: teacherId,
            };
        });

        await models.TeacherSPL_CommitteeMember.bulkCreate(teacherId_splId, {
            transaction,
        });

        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        console.log(err);
        throw new Error(err.message);
    }
}

async function findById(splId) {
    const spl = await models.SPL.findByPk(splId, {
        raw: true,
    });

    return spl;
}

async function findActiveSPLByName(splName) {}

async function findActiveSPLByStudentId(studentId) {}

async function findAllSPLByStudentId(studentId) {}

async function findAll() {}

async function findAllActiveSPL() {}

// async function assignStudents(splId, studentIds) {
//     const studentId_splId = [];
//     for (const studentId of studentIds) {
//         studentId_splId.push({
//             studentId,
//             splId,
//         });
//     }

//     await models.StudentSPL.bulkCreate(studentId_splId);
// }

// async function isExists(splName) {
//     const spl = await models.SPL.findOne({
//         where: {
//             splName: splName,
//         },
//         raw: true,
//         attributes: ["splId"],
//     });

//     if (spl) return true;
//     else return false;
// }

// async function isStudentBelongsToSPL(splId, studentId) {
//     const studentSPL = await models.StudentSPL.findOne({
//         where: {
//             splId,
//             studentId,
//         },
//     });

//     if (studentSPL) return true;
//     else return false;
// }

async function removeStudentFromSPL(splId, studentId) {
    await models.StudentSPL.destroy({
        where: {
            splId,
            studentId,
        },
    });
}

export default {
    create,
    findById,
    findActiveSPLByName,
    findActiveSPLByStudentId,
    findActiveSPLByStudentId,
    removeStudentFromSPL,
};
