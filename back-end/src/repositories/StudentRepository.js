import { sequelize, models, Op } from "../configs/mysql.js";

async function create(students) {
    const transaction = await sequelize.transaction();
    try {
        await models.User.bulkCreate(students, {
            include: [models.Student],
            transaction: transaction,
        });

        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        console.log(err);
        throw new Error(err.message);
    }
}

async function findById(studentId) {
    const student = await models.Student.findByPk(studentId, {
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
            exclude: ["studentId"],
        },
    });

    let flattened = {};
    if (student) {
        flattened = { ...student, ...student.User };
        delete flattened.User;
        delete flattened.password;
    }

    return flattened;
}

async function findAll(options) {
    const studentOptions = {};
    if (options?.curriculumYear) studentOptions.curriculumYear = options.curriculumYear;
    if (options?.batch) studentOptions.batch = options.batch;

    const students = await models.Student.findAll({
        include: {
            model: models.User,
            required: true,
            where: {
                active: options?.inactive ? false : true,
            },
        },
        raw: true,
        nest: true,
        attributes: {
            exclude: ["studentId"],
        },
        where: {
            ...studentOptions,
        },
    });

    const flattened = students.map((student) => {
        const user = { ...student, ...student.User };
        delete user.User;
        return user;
    });

    return flattened || [];
}

async function isRollNoExist(rollNo) {
    const roll = await models.Student.findOne({
        where: { rollNo },
        attributes: ["rollNo"],
        raw: true,
    });
    return roll ? true : false;
}

async function isRegistrationNoExist(registrationNo) {
    const registration = await models.Student.findOne({
        where: { registrationNo },
        attributes: ["registrationNo"],
        raw: true,
    });
    return registration ? true : false;
}

async function findAllExistedRollNo(rollNumbers) {
    const students = await models.Student.findAll({
        where: {
            rollNo: {
                [Op.in]: rollNumbers,
            },
        },
        raw: true,
        attributes: ["rollNo"],
    });

    if (students.length > 0) {
        return students.map((student) => student.rollNo);
    }
    return [];
}

async function findAllExistedRegistrationNo(registrationNumbers) {
    const students = await models.Student.findAll({
        where: {
            registrationNo: {
                [Op.in]: registrationNumbers,
            },
        },
        raw: true,
        attributes: ["registrationNo"],
    });

    if (students.length > 0) {
        return students.map((student) => student.registrationNo);
    }
    return [];
}

async function findAllStudentUnderSPL(splId, options) {
    if (options?.supervisor) {
        const a = 4;
        // supervisor id, name, designation, img url
    }

    const students = await models.Student.findAll({
        include: [
            {
                model: models.User,
                where: {
                    active: true,
                },
                required: true,
            },
            {
                model: models.SPL,
                through: {
                    model: models.StudentSPL,
                    attributes: [],
                },
                where: {
                    splId: splId,
                },
                required: true,
            },
        ],
        raw: true,
        nest: true,
        attributes: {
            exclude: ["studentId"],
        },
    });

    if (students.length == 0) return [];

    const flattened = [];
    students.forEach((student) => {
        const temp = {
            ...student,
            ...student.User,
        };
        delete temp.User;
        delete temp.SPLs;
        flattened.push(temp);
    });

    return flattened;
}

async function findAllStudentNotUnderSPL(splId, curriculumYear) {
    const students = await models.Student.findAll({
        include: [
            {
                model: models.User,
                where: {
                    active: true,
                },
                required: true,
            },
            {
                model: models.SPL,
                through: {
                    model: models.StudentSPL,
                    attributes: [],
                },
                where: {
                    splId: splId,
                },
                required: false,
            },
        ],
        where: {
            curriculumYear,
        },
        raw: true,
        nest: true,
        attributes: {
            exclude: ["studentId"],
        },
    });

    const unassignedStudents = students.filter((student) => {
        return !student.SPLs.splId;
    });

    if (unassignedStudents.length == 0) return [];

    const flattened = [];
    unassignedStudents.forEach((student) => {
        const temp = {
            ...student,
            ...student.User,
        };
        delete temp.User;
        delete temp.SPLs;
        flattened.push(temp);
    });

    return flattened;
}

async function findAllStudentIdUnderSPL(splId) {
    const students = await models.StudentSPL.findAll({
        where: { splId },
        attributes: ["studentId"],
    });
    const ids = students.map((student) => student.studentId);
    if (!ids) return [];
    return ids;
}

async function update(studentId, student, userType) {
    if (userType == "student") await models.User.update(student, { where: { userId: studentId } });
    else if (userType == "admin") await models.Student.update(student, { where: { studentId } });
}

async function findAllStudentIdUnderSupervisor(splId, supervisorId) {
    const students = await models.Supervisor.findAll({ where: { teacherId: supervisorId, splId } });
    if (students.length == 0) return [];
    return students.map((student) => student.studentId);
}

export default {
    create,
    update,
    findById,
    findAll,
    findAllStudentUnderSPL,
    findAllStudentNotUnderSPL,

    // utility methods
    isRollNoExist,
    isRegistrationNoExist,
    findAllStudentIdUnderSPL,
    findAllStudentIdUnderSupervisor,
    findAllExistedRollNo,
    findAllExistedRegistrationNo,
};
