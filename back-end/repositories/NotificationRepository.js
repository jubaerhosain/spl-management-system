import { models } from "../database/db.js";

async function create(data) {
    await models.Notification.create(data);
}

export default {
    create,
};
