import { models, Op } from "../database/mysql.js";

// ------------------------------Create----------------------------------

async function create(user) {}

// ------------------------------Read----------------------------------

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

    if (user) true;
    return false;
}

async function isTeacherByEmail(email) {
    const user = await models.User.findOne({
        where: {
            email: email,
            userType: "teacher",
        },
        raw: true,
        attributes: ["email"],
    });

    if (user) return true;
    return false;
}

async function isStudentByEmail(email) {
    const user = await models.User.findOne({
        where: {
            email: email,
            userType: "student",
        },
        raw: true,
        attributes: ["email"],
    });

    if (user) return true;
    return false;
}

async function isTeacherById(userId) {
    const user = await models.User.findByPk(userId, {
        where: {
            userType: "teacher",
        },
        raw: true,
        attributes: ["email"],
    });

    if (user) return true;
    return false;
}

async function isStudentById(userId) {
    const user = await models.User.findByPk(userId, {
        where: {
            userType: "student",
        },
        raw: true,
        attributes: ["email"],
    });

    if (user) return true;
    return false;
}

async function findExistedEmails(emails) {
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

async function findUserIdByEmail(email) {
    const user = await models.User.findOne({
        where: {
            email: email,
        },
        attributes: ["userId"],
    });

    if (user) return user.userId;
    return null;
}

async function findAllUserIdByEmail(emails) {
    const users = await models.User.findAll({
        where: {
            email: {
                [Op.in]: emails,
            },
        },
        attributes: ["userId"],
    });

    if (users) return users.map((user) => user.userId);
    return null;
}

// ------------------------------Update----------------------------------

async function update(userId, user) {
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

// ------------------------------Delete----------------------------------

export default {
    create,
    isUserExist,
    isEmailExists,
    isTeacherByEmail,
    isStudentByEmail,
    isTeacherById,
    isStudentById,
    findExistedEmails,
    findById,
    findByEmail,
    findLoginInfoByEmail,
    findPasswordByUserId,
    findUserIdByEmail,
    findAllUserIdByEmail,
    update,
    updatePasswordByEmail,
    updatePasswordByUserId,
};
