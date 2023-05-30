import { sequelize, models, Op } from "../database/db.js";
import { generateHashedPassword } from "../utilities/password-utilities.js";
import { writeCredentials } from "../utilities/file-utilities.js";
import { Response } from "../utilities/response-format-utilities.js";

export async function addStudent(req, res, next) {
    try {
        const { students } = req.body;

        // console.log(students);

        const hashedPasswords = await generateHashedPassword(students.length);

        const credentials = [];
        const users = Array.from({ length: students.length }, () => ({}));
        for (const i in students) {
            users[i].name = students[i].name;
            users[i].email = students[i].email;
            (users[i].password = hashedPasswords[i].hashedPassword),
                (users[i].userType = "student");

            delete students[i].name;
            delete students[i].email;

            users[i].Student = [students[i]];
            credentials.push({
                name: users[i].name,
                email: users[i].email,
                password: hashedPasswords[i].originalPassword,
            });
        }

        // console.log(users);

        const transaction = await sequelize.transaction();
        try {
            // add in both User and Student table
            await models.User.bulkCreate(users, {
                include: [models.Student],

                transaction: transaction,
            });

            await transaction.commit();

            res.json(Response.success("Students accounts are created successfully"));

            const credentialData = JSON.stringify(credentials);
            writeCredentials(new Date() + "\n" + credentialData);
        } catch (err) {
            await transaction.rollback();
            console.log(err);
            throw new Error("Internal Server Error");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
    }
}

export async function updateStudent(req, res, next) {
    try {
        const student = req.body;
        const { userId } = req.user;

        // update to User table
        await models.User.update(student, {
            where: {
                userId: userId,
            },
        });

        res.json(Response.success("Account is updated successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
    }
}

/**
 * Update some special fields of student by admin
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function updateStudentByAdmin(req, res, next) {
    try {
        const student = req.body;
        const { studentId } = req.params;

        // update to Student table
        await models.Student.update(student, {
            where: {
                studentId,
            },
        });

        res.json(Response.success("Student is updated successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
    }
}
