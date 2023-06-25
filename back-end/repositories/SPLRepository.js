import { models, sequelize } from "../database/mysql.js";
import emailService from "../services/emailServices/emailService.js";

// -----------------------------------Create-----------------------------

async function create(committee) {
    let committeeMemberIds = committee.committeeMemberIds;
    delete committee.committeeMemberIds;

    const transaction = await sequelize.transaction();
    try {
        const spl = await models.SPL.create(committee, { transaction });

        committeeMemberIds = committeeMemberIds.map((teacherId) => {
            return {
                splId: spl.splId,
                teacherId: teacherId,
            };
        });

        await models.TeacherSPL_CommitteeMember.bulkCreate(committeeMemberIds, {
            transaction,
        });

        await transaction.commit();
    } catch (err) {
        console.log(err);
        await transaction.rollback();
        throw new Error(err.message);
    }
}

async function assignMultipleStudent(spl, studentIds, studentEmails) {
    const studentSPL = [];
    for (const studentId of studentIds) {
        studentSPL.push({
            studentId,
            splId: spl.splId,
        });
    }

    const transaction = await sequelize.transaction();
    try {
        // assign to SPL
        await models.StudentSPL.bulkCreate(studentSPL, {
            transaction: transaction,
        });

        // create mark row in Mark table
        await models.Mark.bulkCreate(studentSPL, {
            transaction: transaction,
        });

        await emailService.sendSPLAssignedEmail(studentEmails, spl.splName, spl.academicYear);

        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        console.log(err);
        throw new Error(err.message);
    }
}

// ------------------------------Checking----------------------------------

async function isExists(splName) {
    const spl = await models.SPL.findOne({
        where: {
            splName: splName,
        },
        raw: true,
        attributes: ["splId"],
    });

    if (spl) return true;
    else return false;
}

async function isStudentBelongsToSPL(splId, studentId) {
    const studentSPL = await models.StudentSPL.findOne({
        where: {
            splId,
            studentId,
        },
    });

    if (studentSPL) return true;
    else return false;
}

// ------------------------------Read--------------------------------
async function findByName(splName) {
    const spl = await models.SPL.findOne({
        where: {
            splName: splName,
        },
        raw: true,
    });

    return spl;
}

// ------------------------------Delete--------------------------------
async function removeStudent(splId, studentId) {
    await models.StudentSPL.destroy({
        where: {
            splId,
            studentId,
        },
    });
}

export default {
    create,
    assignMultipleStudent,
    isExists,
    isStudentBelongsToSPL,
    findByName,
    removeStudent,
};
