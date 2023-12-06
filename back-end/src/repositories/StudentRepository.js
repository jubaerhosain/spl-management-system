import { sequelize, models, Op } from "../configs/mysql.js";

async function createStudent(students) {
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

async function findByRoll(rollNo) {
    const student = await models.Student.findOne({ where: { rollNo } });
    return student;
}

async function findByRegistration(registrationNo) {
    const student = await models.Student.findOne({ where: { registrationNo } });
    return student;
}

async function findAll() {
    const students = await models.Student.findAll({
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

    const flattened = students.map((student) => {
        const user = { ...student, ...student.User };
        delete user.User;
        return user;
    });

    return flattened || [];
}

async function findAllByCurriculumYear(curriculumYear) {
    let students = await models.Student.findAll({
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
        where: {
            curriculumYear: curriculumYear,
        },
    });

    const flattened = students.map((student) => {
        const user = { ...student, ...student.User };
        delete user.User;
        return user;
    });

    return flattened;
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

async function createStudentRequest(studentId, teacherId, splId) {
    await models.SupervisorRequest.create({ studentId, teacherId, splId });
}

async function createStudentSupervisor(studentId, teacherId, splId) {
    await models.StudentTeacher_Supervisor.create({ studentId, teacherId, splId });
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

async function updateByAdmin(student, studentId) {
    // update to Student table
    await models.Student.update(student, { where: { studentId } });
}

async function findSupervisorId(studentId, splId) {
    const supervisor = await models.StudentTeacher_Supervisor.findOne({ where: { studentId, splId } });
    if (!supervisor) return null;
    const supervisorId = supervisor.teacherId;
    return supervisorId;
}

async function findSupervisor(studentId, splId) {}

async function findCurrentSupervisor(studentId) {}

export default {
    createStudent,
    findAll,
    findById,
    findByRoll,
    findByRegistration,
    findAllByCurriculumYear,
    findAllExistedRollNo,
    findAllExistedRegistrationNo,
    findAllStudentUnderSPL,
    findAllStudentNotUnderSPL,
    updateStudent,
    updateByAdmin,
    createStudentRequest,
    createStudentSupervisor,
    findStudentRequest,
    findAllStudentRequest,
    findSupervisorId,
    findCurrentSupervisor,
};
