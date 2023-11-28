import { models } from "../config/mysql.js";

async function create(data) {
    await models.Notification.create(data);
}

export default {
    create,
};
