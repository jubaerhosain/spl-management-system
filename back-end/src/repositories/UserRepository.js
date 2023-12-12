import { models, Op } from "../configs/mysql.js";

async function create(user) {
    await models.User.create(user);
}

async function findById(userId, userType) {
    const user = await models.User.findByPk(userId, {
        raw: true,
    });

    delete user?.password;

    return user;
}

async function findByEmail(email, userType) {
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

async function findAllExistedUserByEmail(emails, userType) {
    const users = await models.User.findAll({
        where: {
            email: {
                [Op.in]: emails,
            },
        },
    });

    return users;
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

async function remove(userId) {
    await models.User.update({ active: false }, { where: { userId } });
}

export default {
    create,
    update,
    findById,
    findByEmail,
    findUserId,
    findPasswordById,
    findLoginInfo,
    findAllExistedEmail,
    findAllExistedUserByEmail,
    updatePasswordById,
    updatePasswordByEmail,
    remove,
};
