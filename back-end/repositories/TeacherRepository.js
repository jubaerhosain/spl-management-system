import { models, sequelize, Op } from "../database/mysql.js";
import emailService from "../services/emailServices/emailService.js";

async function isTeacherExist(teacherId) {
    const teacher = await models.Teacher.findByPk(teacherId, {
        raw: true,
        attributes: ["teacherId"],
    });

    if (teacher) return true;
    return false;
}

/**
 * Create one or more teacher
 * @param {Array} teachers
 */
async function create(teachers, credentials) {
    const transaction = await sequelize.transaction();
    try {
        // add in both User and Teacher table
        await models.User.bulkCreate(teachers, {
            include: [models.Teacher],
            transaction: transaction,
        });

        // have to do here bcz of transaction
        await emailService.sendAccountCreationEmail(credentials);

        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        console.log(err);
        throw new Error(err.message);
    }
}

async function update(teacher, userId) {}

async function findAll() {
    let teachers = await models.Teacher.findAll({
        include: {
            model: models.User,
            required: true,
            where: {
                active: true,
            },
            attributes: {
                exclude: ["password", "active"],
            },
        },
        raw: true,
        nest: true,
        attributes: {
            exclude: ["teacherId"],
        },
    });

    if (teachers.length > 0) {
        // copy the properties of the User to the teachers array
        for (const i in teachers) {
            teachers[i] = { ...teachers[i], ...teachers[i].User };
            delete teachers[i].User;
        }
    }

    return teachers;
}

async function findAllDeactivatedAccounts() {
    let teachers = await models.Teacher.findAll({
        include: {
            model: models.User,
            required: true,
            where: {
                active: false,
            },
            attributes: {
                exclude: ["password", "active"],
            },
        },
        raw: true,
        nest: true,
        attributes: {
            exclude: ["teacherId"],
        },
    });

    if (teachers.length > 0) {
        // copy the properties of the User to the teachers array
        for (const i in teachers) {
            teachers[i] = { ...teachers[i], ...teachers[i].User };
            delete teachers[i].User;
        }
    }

    return teachers;
}

async function findById(userId) {
    // do it find by pk
}

export default {
    isTeacherExist,
    findById,
    create,
    update,
    findAll,
    findAllDeactivatedAccounts,
};
