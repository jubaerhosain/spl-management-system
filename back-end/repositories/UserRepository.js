import { models, Op } from "../config/mysql.js";

async function create(user) {
    await models.User.create(user);
}

async function update(userId, user) {
    await models.User.update(user, {
        where: {
            userId: userId,
        },
    });
}

async function updatePasswordById(userId, password) {
    await models.User.update({ password: password }, { where: { userId } });
}

async function updatePasswordByEmail(email, password) {
    await models.User.update({ password: password }, { where: { email } });
}

async function findById(userId) {
    const user = await models.User.findByPk(userId, {
        raw: true,
    });
    return user;
}

async function findByEmail(email) {
    const user = await models.User.findOne({
        where: {
            email: email,
        },
        raw: true,
    });
    return user;
}

async function findUserId(email) {
    const user = await models.User.findOne({
        where: {
            email: email,
        },
        attributes: ["userId"],
    });

    if (user) return user.userId;
    return null;
}

async function findPasswordById(userId) {
    const user = await models.User.findByPk(userId, {
        raw: true,
        attributes: ["password"],
    });

    if (user) return user.password;
    return null;
}

async function findPasswordByEmail(email) {}

async function findLoginInfo(email) {
    const user = await models.User.findOne({
        where: { email },
        raw: true,
        attributes: ["userId", "email", "password", "userType"],
    });

    return user;
}

async function findAllExistedEmail(emails) {
    const users = await models.User.findAll({
        where: {
            email: {
                [Op.in]: emails,
            },
        },
        attributes: ["email"],
    });

    if (users.length > 0) return users.map((user) => user.email);
    return [];
}

async function remove(userId) {
    console.log(userId);
    await models.User.update({ active: false }, { where: { userId } });
}

export default {
    create,
    update,
    updatePasswordById,
    updatePasswordByEmail,
    findById,
    findByEmail,
    findUserId,
    findPasswordById,
    findPasswordByEmail,
    findLoginInfo,
    findAllExistedEmail,
    remove,
};
