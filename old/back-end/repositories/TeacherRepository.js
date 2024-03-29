import { models, sequelize, Op } from "../config/mysql.js";

async function createTeacher(teachers) {
    const transaction = await sequelize.transaction();
    try {
        await models.User.bulkCreate(teachers, {
            include: [models.Teacher],
            transaction: transaction,
        });

        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        console.log(err);
        throw new Error(err.message);
    }
}

async function findById(userId) {
    const teacher = await models.Teacher.findByPk(userId, {
        include: {
            model: models.User,
            required: true,
            where: {
                active: true,
            },
        },
        raw: true,
        nest: true,
        attributes: {
            exclude: ["teacherId"],
        },
    });

    let flattened = {};
    if (teacher) {
        flattened = { ...teacher, ...teacher.User };
        delete flattened.User;
        delete flattened.password;
    }

    return flattened;
}

async function findAll() {
    let teachers = await models.Teacher.findAll({
        include: {
            model: models.User,
            required: true,
            where: {
                active: true,
            },
        },
        raw: true,
        nest: true,
        attributes: {
            exclude: ["teacherId"],
        },
    });

    if (teachers.length > 0) {
        for (const i in teachers) {
            teachers[i] = { ...teachers[i], ...teachers[i].User };
            delete teachers[i].User;
        }
    }

    return teachers;
}

async function findAllAvailableTeacher() {
    let teachers = await models.Teacher.findAll({
        include: {
            model: models.User,
            required: true,
            where: {
                active: true,
            },
        },
        raw: true,
        nest: true,
        where: {
            available: true,
        },
    });

    if (teachers.length > 0) {
        for (const i in teachers) {
            teachers[i] = { ...teachers[i], ...teachers[i].User };
            delete teachers[i].User;
        }
    }

    return teachers;
}

async function updateTeacher(userId, teacher) {
    const transaction = await sequelize.transaction();
    try {
        // update to User model
        await models.User.update(teacher, {
            where: {
                userId: userId,
            },
            transaction: transaction,
        });

        // update to Teacher model
        await models.Teacher.update(teacher, {
            where: {
                teacherId: userId,
            },
            transaction: transaction,
        });

        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        console.log(err);
        throw new Error(err.message);
    }
}

export default {
    createTeacher,
    findById,
    findAll,
    findAllAvailableTeacher,
    updateTeacher,
};
