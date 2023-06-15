import { models, Op } from "../database/db.js";

/**
 * @param {String} email
 */
async function checkEmailExistence(email) {
    const user = await models.findOne({
        where: {
            email: email,
        },
        raw: true,
        attributes: ["email"],
    });
    return user;
}

/**
 * @param {Array} emails
 */
async function checkMultipleEmailExistence(emails) {
    const user = await models.findAll({
        where: {
            email: {
                [Op.in]: emails,
            },
        },
        raw: true,
        attributes: ["email"],
    });
    return user;
}

/**
 * @param {Integer} userId
 */
async function findByUserId(userId) {
    const user = await models.User.findByPk(userId, {
        raw: true,
        attributes: {
            exclude: ["password", "active"],
        },
    });
    return user;
}

/**
 * @param {String} email
 */
async function findByEmail(email) {
    const user = await models.User.findOne({
        where: {
            email: email,
        },
        raw: true,
        attributes: {
            exclude: ["password", "active"],
        },
    });
    return user;
}

async function findByEmailWithPassword(email) {
    const user = await models.User.findOne({
        where: {
            email: email,
        },
        raw: true,
    });
    return user;
}

export default {
    checkEmailExistence,
    checkMultipleEmailExistence,
    findByUserId,
    findByEmail,
    findByEmailWithPassword
};
