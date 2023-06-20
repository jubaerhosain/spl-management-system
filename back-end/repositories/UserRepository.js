import { models, Op } from "../database/db.js";

async function isEmailExists(email) {
    const user = await models.User.findOne({
        where: {
            email: email,
        },
        raw: true,
        attributes: ["email"],
    });

    if (user) return user.email;
    return null;
}

/**
 * @param {Array} emails
 */
async function findAllEmails(emails) {
    const user = await models.findAll({
        where: {
            email: {
                [Op.in]: emails,
            },
        },
        raw: true,
        attributes: ["email"],
    });

    if (user) return user.map((user) => user.email);
    return [];
}

/**
 * @param {Integer} userId
 */
async function findById(userId) {
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

async function findLoginInfoByEmail(email) {
    const user = await models.User.findOne({
        where: {
            email: email,
        },
        raw: true,
        attributes: ["userId", "email", "password", "userType"],
    });

    return user;
}

async function findPasswordByUserId(userId) {
    const user = await models.User.findByPk(userId, {
        raw: true,
        attributes: ["password"],
    });

    if (user) return user.password;
    return null;
}

async function updatePasswordByEmail(email, password) {
    await models.User.update(
        { password: password },
        {
            where: {
                email: email,
            },
        }
    );
}

async function updatePasswordByUserId(userId, password) {
    await models.User.update(
        { password: password },
        {
            where: {
                userId: userId,
            },
        }
    );
}

export default {
    isEmailExists,
    findAllEmails,
    findById,
    findByEmail,
    findLoginInfoByEmail,
    findPasswordByUserId,
    updatePasswordByEmail,
    updatePasswordByUserId,
};
