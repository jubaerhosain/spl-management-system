import { sequelize, models, Op } from "../database/mysql.js";
// import { writeCredentials } from "../utilities/file-utilities.js";
// import { Response } from "../utilities/response-format-utilities.js";
// import { generateHashedPassword } from "../utilities/password-utilities.js";

// createTeacherAccount
async function addTeacher(req, res) {
    try {
        const { teachers } = req.body;

        const hashedPasswords = await generateHashedPassword(teachers.length);

        const credentials = [];
        const users = Array.from({ length: teachers.length }, () => ({}));
        for (const i in teachers) {
            users[i].name = teachers[i].name;
            users[i].email = teachers[i].email;
            users[i].password = hashedPasswords[i].hashedPassword;
            users[i].userType = "teacher";

            delete teachers[i].name;
            delete teachers[i].email;

            users[i].Teacher = [teachers[i]];
            credentials.push({
                name: users[i].name,
                email: users[i].email,
                password: hashedPasswords[i].originalPassword,
            });
        }

        // console.log(users);

        const transaction = await sequelize.transaction();
        try {
            // add in both User and Teacher table
            await models.User.bulkCreate(users, {
                include: [models.Teacher],

                transaction: transaction,
            });

            await transaction.commit();

            res.json(Response.success("Teacher accounts are created successfully"));

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

async function updateTeacher(req, res) {
    try {
        const teacher = req.body;
        const { userId } = req.user;

        const transaction = await sequelize.transaction();
        try {
            // update to User model
            await models.User.update(teacher, {
                where: {
                    userId: userId,
                },
                transaction: transaction,
            });

            // update to Teacher model
            await models.Teacher.update(teacher, {
                where: {
                    teacherId: userId,
                },
                transaction: transaction,
            });

            await transaction.commit();

            res.json(Response.success("Account is updated successfully"));
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

export default {
    addTeacher,
    updateTeacher,
}