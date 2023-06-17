import { where } from "sequelize";
import { models, Op } from "../database/db.js";

/**
 * @param {String} email
 */
async function checkEmailExistence(email) {
    const user = await models.User.findOne({
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

async function findByEmailWithPassword(email) {
    const user = await models.User.findOne({
        where: {
            email: email,
        },
        raw: true,
    });
    return user;
}

async function resetPassword(email, password) {
    await models.User.update(
        { password: password },
        {
            where: {
                email: email,
            },
        }
    );
}

export default {
    checkEmailExistence,
    checkMultipleEmailExistence,
    findById,
    findByEmail,
    findByEmailWithPassword,
    resetPassword,
};
