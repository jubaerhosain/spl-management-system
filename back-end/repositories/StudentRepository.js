import { sequelize, models, Op } from "../database/db.js";
import emailService from "../services/emailServices/emailService.js";

async function isStudentExist(studentId) {
    const student = await models.Student.findByPk(studentId, {
        raw: true,
        attributes: ["studentId"],
    });

    if (student) return true;
    return false;
}

async function isRollNoExist(rollNo) {
    const student = await models.Student.findOne({
        where: {
            rollNo: rollNo,
        },
        raw: true,
        attributes: ["rollNo"],
    });

    if (student) return true;
    return false;
}

async function isRegistrationNoExist(registrationNo) {
    const student = await models.Student.findOne({
        where: {
            registrationNo: registrationNo,
        },
        raw: true,
        attributes: ["registrationNo"],
    });

    if (student) return true;
    return false;
}

/**
 * Create one or more student account and send emails
 * @param {Array} students
 */
async function create(students, credentials) {
    const transaction = await sequelize.transaction();
    try {
        // add in both User and Student table
        await models.User.bulkCreate(students, {
            include: [models.Student],
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

async function update(studentId, student) {
    // update to Student table
    await models.Student.update(student, {
        where: {
            studentId: studentId,
        },
    });
}

async function updateByAdmin(student, studentId) {
    // update to Student table
    await models.Student.update(student, {
        where: {
            studentId,
        },
    });
}

async function findAll() {
    let students = await models.Student.findAll({
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
            exclude: ["studentId"],
        },
    });

    if (students.length > 0) {
        // copy the properties of the User to the teachers array
        for (const i in students) {
            students[i] = { ...students[i], ...students[i].User };
            delete students[i].User;
        }
    }

    return students;
}

/**
 *
 * @param {*} curriculumYear
 * @returns {[Promise<Student>]}
 */
async function findAllByCurriculumYear(curriculumYear) {
    let students = await models.Student.findAll({
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
            exclude: ["studentId"],
        },
        where: {
            curriculumYear: curriculumYear,
        },
    });

    if (students.length > 0) {
        // copy the properties of the User to the teachers array
        for (const i in students) {
            students[i] = { ...students[i], ...students[i].User };
            delete students[i].User;
        }
    }

    return students;
}

async function findById(userId) {
    // do it find by pk
    let student = await models.Student.findOne({
        include: [
            {
                model: models.User,
                required: true,
                where: {
                    active: true,
                },
                attributes: {
                    exclude: ["password", "active"],
                },
            },
            {
                model: models.SPL,
                through: {
                    model: models.StudentSPL,
                    attributes: [],
                },
                required: false,
                where: {
                    active: true,
                },
            },
        ],
        raw: true,
        nest: true,
        attributes: {
            exclude: ["studentId"],
        },
        where: {
            studentId: userId,
        },
    });

    if (student) {
        // copy the properties of the User to the student array
        student = { ...student, ...student.User, ...student.SPLs };
        delete student.User;
        delete student.SPLs;
    }

    return student;
}

/**
 * @param {Array} rollNumbers
 */
async function findAllRollNumbers(rollNumbers) {
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
    return null;
}

/**
 *
 * @param {Array} regNumbers
 */
async function findAllRegistrationNumbers(regNumbers) {
    const students = await models.Student.findAll({
        where: {
            registrationNo: {
                [Op.in]: regNumbers,
            },
        },
        raw: true,
        attributes: ["registrationNo"],
    });

    if (students.length > 0) {
        return students.map((student) => student.registrationNo);
    }
    return null;
}

export default {
    isStudentExist,
    isRollNoExist,
    isRegistrationNoExist,
    findAllRollNumbers,
    findAllRegistrationNumbers,
    create,
    findAll,
    findAllByCurriculumYear,
    findById,
    update,
    updateByAdmin,
};
