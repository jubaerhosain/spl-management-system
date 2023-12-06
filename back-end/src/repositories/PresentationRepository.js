import { models } from "../database/mysql.js";

async function create(splId) {
    await models.Presentation.create({
        splId: splId,
    });
}

export default {
    create,
};
