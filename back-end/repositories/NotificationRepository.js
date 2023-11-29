import { models } from "../config/mysql.js";

async function createNotification(notification) {
    await models.Notification.create(notification);
}

async function createMultipleNotification(notifications) {
    await models.Notification.bulkCreate(notifications);
}

export default {
    createNotification,
    createMultipleNotification,
};
