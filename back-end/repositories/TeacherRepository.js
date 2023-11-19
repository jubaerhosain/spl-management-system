import { models, sequelize, Op } from "../data-store/mysql.js";

// --------------------------------Create--------------------------------

async function create(teachers) {
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

// --------------------------------Read--------------------------------
async function findById(userId) {
    const teacher = await models.Teacher.findByPk(userId, {
        include: {
            model: models.User,
            required: true,
            where: {
                active: true,
            },
            attributes: {
                exclude: ["password"],
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

// --------------------------------Update--------------------------------

async function update(userId, teacher) {
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

// --------------------------------Delete--------------------------------

export default {
    create,
    findById,
    findAll,
    findAllDeactivatedAccounts,
    update,
};
