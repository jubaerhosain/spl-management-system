import { sequelize, models, Op } from "../configs/mysql.js";
import utils from "../utils/utils.js";

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

    if (!student) return null;

    const user = student.User;
    delete student.User;
    return { ...user, ...student };
}

async function findByEmail(email) {
    const student = await models.Student.findOne({
        include: {
            model: models.User,
            required: true,
            where: {
                active: true,
                email: email,
            },
        },
        raw: true,
        nest: true,
        attributes: {
            exclude: ["studentId"],
        },
    });

    if (!student) return null;

    const flattened = { ...student, ...student.User };
    delete flattened.User;
    delete flattened.password;
    return flattened;
}

async function findAll(options) {
    const studentOptions = {};
    if (options?.curriculumYear) studentOptions.curriculumYear = options.curriculumYear;
    if (options?.batch) studentOptions.batch = options.batch;

    let students = await models.Student.findAll({
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

    students = students.map((student) => {
        const user = student.User;
        delete student.User;
        return { ...user, ...student };
    });

    return students || [];
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
    const includes = [
        {
            model: models.User,
            where: {
                active: true,
            },
            required: true,
        },
        {
            // to identify student under spl
            model: models.SPL,
            through: {
                model: models.StudentSPL_Enrollment,
                attributes: [],
            },
            where: {
                splId: splId,
            },
            required: true,
            attributes: [],
        },
    ];

    if (options?.supervisor) {
        includes.push({
            model: models.Teacher,
            as: "Supervisors",
            include: {
                model: models.User,
            },
            through: {
                model: models.StudentTeacher_Supervisor,
                where: { splId },
                attributes: [],
            },
            required: false,
            attributes: {
                exclude: ["teacherId"],
            },
        });
    }

    if (options?.project) {
        includes.push({
            model: models.Project,
            through: {
                model: models.ProjectStudent_Contributor,
                attributes: [],
            },
            where: { splId },
            required: false,
        });
    }

    let students = await models.Student.findAll({
        include: includes,
        raw: true,
        nest: true,
        attributes: {
            exclude: ["studentId"],
        },
    });

    if (students.length == 0) return [];

    students = students.map((student) => {
        const studentUser = student.User;
        delete student.User;

        const result = {};
        if (options?.supervisor) {
            const teacher = student.Supervisors;
            delete student.Supervisors;

            const teacherUser = teacher.User;
            delete teacher.User;
            result.supervisor = { ...teacherUser, ...teacher };
        }
        if (options?.project) {
            const project = student.Projects;
            delete student.Projects;
            result.project = { ...project };
        }

        return { ...studentUser, ...student, ...result };
    });

    const flattened = [];
    students.forEach((student) => {
        const temp = {
            ...student.User,
            ...student,
        };
        delete temp.User;
        delete temp.SPLs;
        flattened.push(temp);
    });

    return students || [];
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
                    model: models.StudentSPL_Enrollment,
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
    const students = await models.StudentSPL_Enrollment.findAll({
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

async function isStudentUnderSPL(studentId, splId) {
    const studentSpl = await models.StudentSPL_Enrollment.findOne({ where: { studentId, splId } });
    return studentSpl ? true : false;
}

async function addSupervisor(studentId, supervisorId, splId) {
    await models.StudentTeacher_Supervisor.create({ teacherId: supervisorId, studentId, splId });
}

async function isSupervisorExist(studentId, splId) {
    const supervisor = await models.StudentTeacher_Supervisor.findOne({ where: { studentId, splId }, raw: true });
    return supervisor?.teacherId ? true : false;
}

async function findSupervisorId(studentId, splId) {
    const supervisor = await models.StudentTeacher_Supervisor.findOne({ where: { studentId, splId }, raw: true });
    return supervisor?.teacherId ? supervisor.teacherId : null;
}

export default {
    create,
    update,
    findById,
    findByEmail,
    findAll,
    findAllStudentUnderSPL,
    findAllStudentNotUnderSPL,
    addSupervisor,

    // utility methods
    isRollNoExist,
    isRegistrationNoExist,
    findAllStudentIdUnderSPL,
    // findAllStudentIdUnderSupervisor,
    findAllExistedRollNo,
    findAllExistedRegistrationNo,
    isStudentUnderSPL,
    isSupervisorExist,
    findSupervisorId,
};
