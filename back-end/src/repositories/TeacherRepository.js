import { models, sequelize, Op } from "../configs/mysql.js";
import utils from "../utils/utils.js";

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

async function findById(userId, options) {
    const teacherOptions = {};
    if (options?.available) teacherOptions.available = 1;

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
        where: teacherOptions,
    });

    if (!teacher) return null;

    let flattened = {};
    if (teacher) {
        flattened = { ...teacher, ...teacher.User };
        delete flattened.User;
        delete flattened.password;
    }

    return flattened;
}

async function findAll(options) {
    const teacherOption = {};
    if (options?.available) teacherOption.available = 1;

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
        where: teacherOption,
    });

    if (teachers.length > 0) {
        for (const i in teachers) {
            teachers[i] = { ...teachers[i], ...teachers[i].User };
            delete teachers[i].User;
        }
    }

    return teachers;
}

async function findAllWithRequestedFlag(options) {
    const teacherOption = {};
    if (options?.available) teacherOption.available = 1;

    const requestOptions = {};
    if (options?.studentId) requestOptions.studentId = options.studentId;
    if (options?.teamId) requestOptions.teamId = options.teamId;

    let teachers = await models.Teacher.findAll({
        include: [
            {
                model: models.User,
                required: true,
                where: {
                    active: true,
                },
            },
            {
                model: models.SupervisorRequest,
                as: "Requests",
                required: false,
                where: requestOptions,
            },
        ],
        raw: true,
        nest: true,
        attributes: {
            exclude: ["teacherId"],
        },
        where: teacherOption,
    });

    if (teachers.length > 0) {
        for (const i in teachers) {
            const request = teachers[i].Requests;
            delete teachers[i].Requests;
            if (!utils.areAllKeysNull(request)) {
                teachers[i].requested = true;
            }
            teachers[i] = { ...teachers[i], ...teachers[i].User };
            delete teachers[i].User;
        }
    }

    return teachers;
}

async function findAllExistedTeacherByEmail(emails) {
    const users = await models.User.findAll({
        include: {
            model: models.Teacher,
            required: true,
            attributes: {
                exclude: ["teacherId"],
            },
        },
        where: {
            email: {
                [Op.in]: emails,
            },
            userType: "teacher",
        },
        raw: true,
        nest: true,
    });

    const flattened = [];
    users.forEach((user) => {
        const teacher = {
            ...user,
            ...user.Teacher,
        };
        delete teacher.Teacher;
        flattened.push(teacher);
    });

    return flattened;
}

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

export default {
    create,
    findById,
    update,
    findAll,
    findAllWithRequestedFlag,
    // findAllExistedTeacherByEmail,
};
