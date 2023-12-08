import { models, sequelize } from "../configs/mysql.js";

async function createCommittee(data) {
    const transaction = await sequelize.transaction();
    try {
        const committee = await models.SPLCommittee.create(
            {
                committeeId: data.splId,
                head: data.head,
                manager: data.manager,
            },
            { transaction }
        );

        const members = [];
        data.members.forEach((member) => {
            members.push({
                committeeId: committee.committeeId,
                teacherId: member.memberId,
            });
        });

        await models.CommitteeMember.bulkCreate(members, { transaction });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        throw new Error("Error creating committee");
    }
}

async function findById(committeeId) {
    const committee = await models.SPLCommittee.findOne({ where: { committeeId } });
    return committee;
}

export default {
    createCommittee,
    findById,
};
