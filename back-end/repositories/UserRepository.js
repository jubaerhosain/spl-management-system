import { models, Op } from "../database/mysql.js";

async function isUserExist(userId) {
    const user = await models.User.findByPk(userId, {
        raw: true,
        attributes: ["userId"],
    });

    if (user) return true;
    return false;
}

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
    const user = await models.User.findAll({
        where: {
            email: {
                [Op.in]: emails,
            },
        },
        raw: true,
        attributes: ["email"],
    });

    if (user.length > 0) return user.map((user) => user.email);
    return null;
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

async function updateAccount(userId, user) {
    await models.User.update(user, {
        where: {
            userId: userId,
        },
    });
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
    isUserExist,
    isEmailExists,
    findAllEmails,
    findById,
    findByEmail,
    findLoginInfoByEmail,
    findPasswordByUserId,
    updatePasswordByEmail,
    updatePasswordByUserId,
    updateAccount,
};
