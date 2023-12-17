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

async function findById(teacherId, options) {
    const teacherOptions = {};
    if (options?.available) teacherOptions.available = 1;

    const teacher = await models.Teacher.findByPk(teacherId, {
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

    const user = teacher.User;
    delete teacher.User;

    return { ...user, ...teacher };
}

async function findByEmail(email, options) {
    const teacherOptions = {};
    if (options?.available) teacherOptions.available = 1;

    const teacher = await models.Teacher.findOne({
        include: {
            model: models.User,
            required: true,
            where: {
                active: true,
                email,
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

    const flattened = { ...teacher, ...teacher.User };
    delete flattened.User;
    delete flattened.password;

    return flattened;
}

async function findAll(options) {
    const teacherOption = {};
    if (options?.available) teacherOption.available = 1;

    // include user table
    const includes = [
        {
            model: models.User,
            required: true,
            where: {
                active: true,
            },
        },
    ];

    if (options?.studentId || options?.teamId) {
        const requestOptions = {};
        if (options?.studentId) requestOptions.studentId = options.studentId;
        else if (options?.teamId) requestOptions.teamId = options.teamId;
        includes.push({
            model: models.SupervisorRequest,
            required: false,
            where: requestOptions,
        });
    }

    let teachers = await models.Teacher.findAll({
        include: includes,
        raw: true,
        nest: true,
        attributes: {
            exclude: ["teacherId"],
        },
        where: teacherOption,
    });

    teachers = teachers.map((teacher) => {
        const request = teachers.SupervisorRequests;
        delete teacher.SupervisorRequests;
        if (!utils.areAllKeysNull(request)) {
            teacher.request = { requestId: request.requestId };
        }
        const user = teacher.User;
        delete teacher.User;
        return { ...user, ...teacher };
    });

    return teachers || [];
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

async function update(teacherId, teacher) {
    const transaction = await sequelize.transaction();
    try {
        // update to User model
        await models.User.update(teacher, {
            where: {
                userId: teacherId,
            },
            transaction: transaction,
        });

        // update to Teacher model
        await models.Teacher.update(teacher, {
            where: {
                teacherId,
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
    findByEmail,
    update,
    findAll,
    // findAllExistedTeacherByEmail,
};
