import fs from "fs";
import path from "path";
import createError from "http-errors";
import { sequelize, models, Op } from "../database/db.js";
import { createUserFromEmail } from "../utilities/user-utilities.js";
import { sendAccountCreationEmail, sendEmail } from "../utilities/email-utilities.js";
import { Response } from "../utilities/response-format-utilities.js";
import { getDirname } from "../utilities/fileUtilities.js";
import { getCurriculumYear, getSPLName } from "../utilities/spl-utilities.js";

async function addAdmin(req, res, next) {
    try {
        const email = req.body.email;

        let admin = await createUserFromEmail([email]);
        admin = admin[0];
        const originalPassword = admin.originalPassword;
        delete admin.originalPassword;
        admin.userType = "admin";

        const transaction = await sequelize.transaction();
        try {
            await models.User.create(admin, { transaction: transaction });

            const html = `
            <p>Dear Sir,</p>

    <p>Your account has been created successfully as admin of SPL Management System.</P>
    <P>Here are your login credentials:</p>

    <p><strong>Email:</strong> ${email} <br>
    <strong>Temporary Password:</strong> ${originalPassword} </p>

    <p>Please log in to your account using these credentials and reset your password. It is important to reset your password as soon as possible to ensure your account's security.</p>

    <p>We take the security of your account seriously and encourage you to take the following precautions to ensure that your information remains secure:</p>

    <ul>
        <li>Keep your password safe and do not share it with anyone.</li>
        <li>Use a strong, unique password that is not easily guessable.</li>
        <li>Avoid using the same password for multiple accounts.</li>
        <li>Always log out of your account when you're finished using it, especially if you're using a shared computer or device.</li>
        <li>Be wary of phishing emails and never provide your password or other sensitive information in response to unsolicited requests.</li>
    </ul>

    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>
            `;

            await sendEmail(email, "Congratulations! You've been added as admin.", html);

            await transaction.commit();

            res.status(200).json(Response.success("Admin account created successfully"));
        } catch (err) {
            await transaction.rollback();
            console.log(err);
            res.status(500).json(Response.error("Internal Server Error"));
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

/**
 * add one or more students to the database
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function addStudent(req, res, next) {
    try {
        const { students } = req.body;
        const emails = students.map((student) => student.email);

        const users = await createUserFromEmail(emails);

        const emailPassword = [];
        for (const user of users) {
            emailPassword.push({
                email: user.email,
                password: user.originalPassword,
            });
            delete user.originalPassword;
            user.userType = "student";
        }

        const transaction = await sequelize.transaction();
        try {
            // add to user model
            const newUsers = await models.User.bulkCreate(users, {
                transaction: transaction,
            });

            // {studentId, rollNo, registrationNo, batch, session, curriculumYear}
            for (let i = 0; i < newUsers.length; i++) {
                for (let j = 0; j < students.length; j++) {
                    if (students[j].email == newUsers[i].email) {
                        students[j].studentId = newUsers[i].userId;
                    }
                }
            }

            // add to student model
            await models.Student.bulkCreate(students, {
                transaction: transaction,
            });

            await sendAccountCreationEmail(emailPassword);

            await transaction.commit();

            console.log(emailPassword);

            res.status(200).json({
                message: "Student accounts are created successfully",
            });
        } catch (err) {
            await transaction.rollback();
            console.log(err);
            throw new createError(err.status || 500, err.message);
        }
    } catch (err) {
        console.log(err);
        next(new createError(err.status || 500, err.message));
    }
}

/**
 * Update a student account
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function updateStudent(req, res, next) {
    try {
        const student = req.body;
        const { userId } = req.user;

        // update to user table
        await models.User.update(student, {
            where: {
                userId: userId,
            },
        });

        res.json({
            message: "Account is updated successfully",
        });
    } catch (err) {
        console.log(err);
        next(new createError(err.status || 500, err.message));
    }
}

/**
 * Update some special fields of student by admin
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function updateStudentByAdmin(req, res, next) {
    try {
        const student = req.body;
        const { studentId } = req.params;

        // update to Student table
        await models.Student.update(student, {
            where: {
                studentId,
            },
        });

        res.json({
            message: "Student account is updated successfully",
        });
    } catch (err) {
        console.log(err);
        next(new createError(err.status || 500, err.message));
    }
}

/**
 * add one or more teachers to the database
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function addTeacher(req, res, next) {
    try {
        const { teachers } = req.body;
        const emails = teachers.map((teacher) => teacher.email);

        const users = await createUserFromEmail(emails);

        const emailPassword = [];
        for (const user of users) {
            emailPassword.push({
                email: user.email,
                password: user.originalPassword,
            });
            delete user.originalPassword;
            user.userType = "teacher";

            for (const t of teachers) {
                if (t.email === user.email) {
                    user.name = t.name;
                    break;
                }
            }
        }

        // console.log(teachers, users);

        const transaction = await sequelize.transaction();
        try {
            const newUsers = await models.User.bulkCreate(users, {
                transaction: transaction,
            });

            for (let i = 0; i < newUsers.length; i++) {
                for (let j = 0; j < teachers.length; j++) {
                    if (teachers[j].email === newUsers[i].email) {
                        teachers[j].teacherId = newUsers[i].userId;
                        break;
                    }
                }
            }

            // console.log(teachers);

            // throw new Error("sadfa");

            await models.Teacher.bulkCreate(teachers, {
                transaction: transaction,
            });

            await sendAccountCreationEmail(emailPassword);

            await transaction.commit();

            console.log(emailPassword);

            res.status(200).json({
                message: "Teacher accounts are created successfully",
            });
        } catch (err) {
            await transaction.rollback();
            console.log(err);
            next(new createError(err.status || 500, err.message));
        }
    } catch (err) {
        console.log(err);
        next(new createError(err.status || 500, err.message));
    }
}

/**
 * Update a teacher account
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function updateTeacher(req, res, next) {
    try {
        const teacher = req.body;
        const { userId } = req.user;

        const transaction = await sequelize.transaction();
        try {
            // update to user model
            await models.User.update(teacher, {
                where: {
                    userId: userId,
                },
                transaction: transaction,
            });

            // update to teacher model
            await models.Teacher.update(teacher, {
                where: {
                    teacherId: userId,
                },
                transaction: transaction,
            });

            await transaction.commit();

            res.json({
                message: "Account is updated successfully",
            });
        } catch (err) {
            await transaction.rollback();
            console.log(err);
            throw new createError(err.status || 500, err.message);
        }
    } catch (err) {
        console.log(err);
        next(new createError(err.status || 500, err.message));
    }
}

/**
 * Delete previous avatar if it exists and
 * save the avatar path to the database
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function saveAvatar(req, res, next) {
    try {
        const { userId } = req.user;
        const { filename } = req.file;

        // previous avatar
        const user = await models.User.findOne({
            where: {
                userId,
            },
            attributes: ["avatar"],
            raw: true,
        });

        const transaction = await sequelize.transaction();
        try {
            // save new avatar
            await models.User.update(
                {
                    avatar: filename,
                },
                {
                    where: {
                        userId,
                    },
                    transaction: transaction,
                }
            );

            // delete previous avatar
            if (user.avatar) {
                const oldAvatarPath = path.join(
                    getDirname(import.meta.url),
                    "/../public/uploads/avatars/" + user.avatar
                );

                // why cannot use await here
                fs.unlink(oldAvatarPath, function (err) {
                    if (err) {
                        console.log(err);
                        throw new createError(500, "Internal server error");
                    }
                    console.log(`'${oldAvatarPath}'` + " deleted successfully.");
                });
            }

            transaction.commit();

            res.json({
                message: "Avatar uploaded successfully.",
            });
        } catch (err) {
            await transaction.rollback();
            console.log(err);
            throw new createError(err.status || 500, err.message);
        }
    } catch (err) {
        console.log(err);
        next(new createError(err.status || 500, err.message));
    }
}

async function deactivateUser(req, res, next) {
    res.json({
        message: `${req.params.userId} deactivated successfully`,
    });
}

/**
 * Get a user by Logged in
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getUser(req, res, next) {
    try {
        // if authenticated the req.user is defined
        const { userType, userId } = req.user;

        let retrievedUser = "";
        if (userType === "admin") {
            retrievedUser = await models.User.findOne({
                where: {
                    userId: userId,
                    active: true,
                },
                raw: true,
                attributes: ["userId", "name", "email", "avatar"],
            });
        } else if (userType === "teacher") {
            retrievedUser = await models.User.findOne({
                include: {
                    model: models.Teacher,
                },
                where: {
                    userId: userId,
                },
                raw: true,
                nest: true,
                attributes: { exclude: ["password"] },
            });

            const teacher = retrievedUser.Teacher;

            retrievedUser = { ...retrievedUser, ...teacher };
            delete retrievedUser.Teacher;
        } else if (userType === "student") {
            retrievedUser = await models.User.findOne({
                include: {
                    model: models.Student,
                    include: {
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
                },

                where: {
                    userId: userId,
                },
                raw: true,
                nest: true,
                attributes: { exclude: ["password"] },
            });

            const student = retrievedUser.Student;
            const spl = student.SPLs;

            console.log(retrievedUser, student, spl);

            retrievedUser = { ...retrievedUser, ...student, ...spl };
            delete retrievedUser.Student;
            delete retrievedUser.SPLs;
        }

        res.json(Response.success("User retrieved successfully", retrievedUser));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function getAvatar(req, res, next) {
    const fileName = req.params.fileName;
    res.sendFile(path.join(getDirname(import.meta.url), "../public/uploads/avatars", fileName));
}

async function getStudentByCurriculumYear(req, res, next) {
    try {
        const { curriculumYear } = req.params;
        let users = await models.User.findAll({
            include: {
                model: models.Student,
                where: {
                    curriculumYear,
                },
            },
            where: {
                active: true,
                userType: "student",
            },
            raw: true,
            nest: true,
            attributes: { exclude: ["password"] },
        });

        for (let inx in users) {
            const student = users[inx].Student;

            users[inx] = { ...users[inx], ...student };
            delete users[inx].Student;
        }

        // console.log(users);

        res.json(Response.success("Successfully retrieved students", users));
    } catch (err) {
        console.log(err);
        Response.status(500).json("Internal Server Error");
    }
}

async function getAllTeacher(req, res, next) {
    try {
        let users = await models.User.findAll({
            include: {
                model: models.Teacher,
            },
            where: {
                active: true,
                userType: "teacher",
            },
            raw: true,
            nest: true,
            attributes: { exclude: ["password"] },
        });

        for (let inx in users) {
            const teacher = users[inx].Teacher;

            users[inx] = { ...users[inx], ...teacher };
            delete users[inx].Teacher;
        }

        // console.log(users);

        res.json(Response.success("Successfully retrieved teachers", users));
    } catch (err) {
        console.log(err);
        Response.status(500).json("Internal Server Error");
    }
}

async function getStudentAndSupervisor(req, res, next) {
    try {
        const { curriculumYear } = req.params;

        const splName = getSPLName(curriculumYear);

        const spl = await models.SPL.findOne({
            where: { splName: splName, active: true },
            raw: true,
        });

        if(!spl) {
            res.status(400).json(Response.error("No SPL found"));
            return;
        }

        let users = await models.User.findAll({
            include: {
                model: models.Student,
                where: {
                    curriculumYear,
                },
            },
            where: {
                active: true,
                userType: "student",
            },
            raw: true,
            nest: true,
            attributes: { exclude: ["password"] },
        });

        // find supervisor
        const teachers = await models.StudentSupervisor.findAll({
            where: {
                studentId: {
                    [Op.in]: users.map((user) => user.userId),
                },
                splId: spl.splId,
            },
            raw: true,
        });

        // console.log(teachers);

        const teacherNames = await models.User.findAll({
            where: {
                userId: {
                    [Op.in]: teachers.map((teacher) => teacher.teacherId),
                },
            },
            raw: true,
            attributes: ["userId", "name"],
        });

        for (let inx in users) {
            const student = users[inx].Student;

            users[inx] = { ...users[inx], ...student };
            delete users[inx].Student;

            // add supervisor id
            for (const item of teachers) {
                if (item.studentId == student.studentId) {
                    users[inx].supervisorId = item.teacherId;
                    break;
                }
            }
        }

        // add supervisor name
        for (let inx in users) {
            const student = users[inx];
            for (const name of teacherNames) {
                if (student.supervisorId == name.userId) {
                    users[inx].supervisorName = name.name;
                    break;
                }
            }
        }

        // console.log(users);

        res.json(Response.success("Successfully retrieved students", users));
    } catch (err) {
        console.log(err);
        Response.status(500).json("Internal Server Error");
    }
}

// the students who requested the teacher for spl3
async function getRequestedStudents(req, res, next) {
    try {
        const { userId } = req.user;

        let studentIds = await models.StudentRequest.findAll({
            where: {
                teacherId: userId,
            },
            raw: true,
            attributes: ["studentId"],
        });
        studentIds = studentIds.map((student) => student.studentId);

        let users = await models.User.findAll({
            include: {
                model: models.Student,
                where: {
                    curriculumYear: "4th",
                },
            },
            where: {
                active: true,
                userType: "student",
                userId: {
                    [Op.in]: studentIds,
                },
            },
            raw: true,
            nest: true,
            attributes: { exclude: ["password"] },
        });

        for (let inx in users) {
            const student = users[inx].Student;

            users[inx] = { ...users[inx], ...student };
            delete users[inx].Student;
        }

        // console.log(users);

        res.json(Response.success("Successfully retrieved students", users));
    } catch (error) {
        console.log(error);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function getStudentAsSupervisor(req, res, next) {
    try {
        const { userId } = req.user;

        let studentIds = await models.StudentSupervisor.findAll({
            where: {
                teacherId: userId,
            },
            raw: true,
            attributes: ["studentId"],
        });
        studentIds = studentIds.map((student) => student.studentId);

        let users = await models.User.findAll({
            include: {
                model: models.Student,
                include: [
                    {
                        model: models.SPL,
                        through: {
                            model: models.StudentSPL,
                            attributes: [],
                        },
                        where: {
                            active: true,
                        },
                        required: false,
                    },
                    {
                        model: models.Mark,
                    },
                ],
                required: true,
            },
            where: {
                userType: "student",
                userId: {
                    [Op.in]: studentIds,
                },
            },
            raw: true,
            nest: true,
            attributes: { exclude: ["password"] },
        });

        console.log(users);

        for (let inx in users) {
            const student = users[inx].Student;
            const spl = users[inx].Student.SPLs;
            const marks = users[inx].Student.Marks;

            users[inx] = { ...users[inx], ...student, ...spl, ...marks };
            delete users[inx].Student;
            delete users[inx].SPLs;
            delete users[inx].Marks;
        }

        console.log(users);

        res.json(Response.success("Successfully retrieved students", users));
    } catch (error) {
        console.log(error);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function getStudentsForSPLManager() {
    try {
        const { splId } = req.spl;

        const curriculumYear = getCurriculumYear(req.spl.splName);

        let users = await models.User.findAll({
            include: {
                model: models.Student,
                where: {
                    curriculumYear,
                },
            },
            where: {
                active: true,
                userType: "student",
            },
            raw: true,
            nest: true,
            attributes: { exclude: ["password"] },
        });

        for (let inx in users) {
            const student = users[inx].Student;

            users[inx] = { ...users[inx], ...student };
            delete users[inx].Student;
        }

        console.log(users);

        res.json(Response.success("Successfully retrieved students", users));
    } catch (error) {
        console.log(error);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function findCurriculumYear(req, res, next) {
    try {
        const { userId } = req.user;

        const student = await models.Student.findOne({
            where: {
                studentId: userId,
            },
            raw: true,
        });

        res.json(Response.success("Successfully retrieved students", student));
    } catch (error) {
        console.log(error);
        res.status(500).json(Response.json("Internal Server Error"));
    }
}

export {
    addAdmin,
    addStudent,
    addTeacher,
    updateStudent,
    updateTeacher,
    updateStudentByAdmin,
    saveAvatar,
    deactivateUser,
    getUser,
    getAvatar,
    getStudentByCurriculumYear,
    getAllTeacher,
    getStudentAndSupervisor,
    getRequestedStudents,
    getStudentAsSupervisor,
    getStudentsForSPLManager,
    findCurriculumYear,
};
