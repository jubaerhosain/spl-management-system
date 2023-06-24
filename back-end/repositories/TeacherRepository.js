import { models, Op } from "../database/mysql.js";

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
async function create(teachers) {}

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
