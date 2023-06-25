import { models, sequelize } from "../database/mysql.js";

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

export default {
    isExists,
    create,
};
