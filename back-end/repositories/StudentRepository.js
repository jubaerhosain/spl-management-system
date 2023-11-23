import { sequelize, models, Op } from "../config/mysql.js";

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

// async function findAllUnassignedStudent(splId, curriculumYear) {
//     // find all active students of ${curriculumYear} left join with ${splName}
//     const students = await models.Student.findAll({
//         include: [
//             {
//                 model: models.User,
//                 where: {
//                     active: true,
//                 },
//                 required: true,
//             },
//             {
//                 model: models.SPL,
//                 through: {
//                     model: models.StudentSPL,
//                     attributes: [],
//                 },
//                 where: {
//                     splId: splId,
//                 },
//                 required: false,
//             },
//         ],
//         where: {
//             curriculumYear,
//         },
//         raw: true,
//         nest: true,
//         attributes: ["studentId"],
//     });

//     const unassignedStudents = students.filter((student) => {
//         return !student.SPLs.splId;
//     });

//     const unassignedStudentIds = unassignedStudents.map((student) => student.studentId);
//     const unassignedStudentEmails = unassignedStudents.map((student) => student.User.email);

//     return { unassignedStudentIds, unassignedStudentEmails };
// }

async function update(studentId, student) {
    // update to Student table
    // await models.Student.update(student, {
    //     where: {
    //         studentId: studentId,
    //     },
    // });
}

async function updateByAdmin(student, studentId) {
    // update to Student table
    await models.Student.update(student, {
        where: {
            studentId,
        },
    });
}

export default {
    create,
    findAll,
    findById,
    findByRoll,
    findByRegistration,
    findAllByCurriculumYear,
    findAllExistedRollNo,
    findAllExistedRegistrationNo,
    update,
    updateByAdmin,
};
