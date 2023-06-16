import { sequelize, models, Op } from "../database/db.js";

/**
 * Create one or more student account
 * @param {Array} students
 */
async function create(students) {
    const transaction = await sequelize.transaction();
    try {
        // add in both User and Student table
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

async function update(student, userId) {
    // update to User table
    await models.User.update(student, {
        where: {
            userId: userId,
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

export default {
    create,
    findAll,
    findAllByCurriculumYear,
    findById,
    update,
    updateByAdmin,
};
