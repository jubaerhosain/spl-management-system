import { models } from "../database/mysql.js";

async function create(committee) {}

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
