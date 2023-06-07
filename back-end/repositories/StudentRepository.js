import { models, Op } from "../database/db.js";

/**
 * Create one or more student account
 * @param {Array} students
 */
async function createStudents(students) {}

async function findAllStudents() {
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

async function findStudentsByCurriculumYear(curriculumYear) {
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

async function findStudentByUserId(userId) {
    let student = await models.Student.findOne({
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
            studentId: userId,
        },
    });

    if (student) {
        // copy the properties of the User to the teachers array
        student = { ...student, ...student.User };
        delete student.User;
    }

    return student;
}

export default {
    createStudents,
    findAllStudents,
    findStudentsByCurriculumYear,
    findStudentByUserId,
};
