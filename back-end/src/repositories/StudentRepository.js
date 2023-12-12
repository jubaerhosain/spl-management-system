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

async function findAllStudentUnderSPL(splId) {
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
    // find all active students of ${curriculumYear} left join with ${splId}
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

async function createStudentRequest(studentId, teacherId, splId) {
    await models.SupervisorRequest.create({ studentId, teacherId, splId });
}

async function createStudentSupervisor(studentId, teacherId, splId) {
    await models.Supervisor.create({ studentId, teacherId, splId });
}

async function findStudentRequest(studentId, teacherId) {
    const request = await models.SupervisorRequest.findOne({ where: { studentId, teacherId } });
    return request;
}

async function findAllStudentRequest(studentId, teacherId) {}

async function updateStudent(studentId, student) {
    // update to Student table
    // await models.Student.update(student, {
    //     where: {
    //         studentId: studentId,
    //     },
    // });
}

async function update(studentId, student, userType) {
    if (userType == "student") await models.User.update(student, { where: { userId: studentId } });
    else if (userType == "admin") await models.Student.update(student, { where: { studentId } });
}

async function findSupervisorId(studentId, splId) {
    const supervisor = await models.Supervisor.findOne({ where: { studentId, splId } });
    if (!supervisor) return null;
    const supervisorId = supervisor.teacherId;
    return supervisorId;
}

async function findSupervisor(studentId, splId) {}

async function findCurrentSupervisor(studentId) {}

async function findAllStudentIdUnderSupervisor(splId, supervisorId) {
    const students = await models.Supervisor.findAll({ where: { teacherId: supervisorId, splId } });
    if (students.length == 0) return [];
    return students.map((student) => student.studentId);
}

export default {
    create,
    findById,
    findAll,
    update,
    // findAllExistedRollNo,
    // findAllExistedRegistrationNo,
    // findAllStudentUnderSPL,
    // findAllStudentNotUnderSPL,
    // findAllStudentIdUnderSupervisor,
    // updateStudent,
    // updateByAdmin,
    // createStudentRequest,
    // createStudentSupervisor,
    // findStudentRequest,
    // findAllStudentRequest,
    // findSupervisorId, // move to supervisor repository
    // findCurrentSupervisor,

    // utility methods
    isRollNoExist,
    isRegistrationNoExist,
    findAllStudentIdUnderSPL,
};
