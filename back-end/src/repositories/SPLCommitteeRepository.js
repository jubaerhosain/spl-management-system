import { models } from "../configs/mysql.js";

async function createCommittee(data) {
    await models.SPLCommittee.create(data);
}

async function findById(committeeId) {
    const committee = await models.SPLCommittee.findOne({ where: { committeeId } });
    return committee;
}

export default {
    createCommittee,
    findById,
};
