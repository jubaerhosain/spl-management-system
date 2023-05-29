import fs from "fs";
import path from "path";
import { sequelize, models, Op } from "../database/db.js";
import { generateHashedPassword } from "../utilities/password-utilities.js";
import { writeCredentials } from "../utilities/file-utilities.js";

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
            users[i].password = hashedPasswords[i].hashedPassword,
            users[i].userType = "student";

            delete students[i].name;
            delete students[i].email;

            users[i].Student = [students[i]]
            credentials.push({
                name: users[i].name,
                email: users[i].email,
                password: hashedPasswords[i].originalPassword,
            });
        }

        console.log(users)

        const transaction = await sequelize.transaction();
        try {
            await models.User.bulkCreate(users, {
                include: [models.Student],

                transaction: transaction,
            });

            res.status(200).json({
                message: "add student message",
            });

            await transaction.commit();

            const credentialData = JSON.stringify(credentials);
            writeCredentials(new Date() + "\n" + credentialData);
        } catch (err) {
            await transaction.rollback();
            console.log(err);
            throw new Error("Internal Server Error");
        }
    } catch (err) {
        console.log(err);
        res.send("Error");
    }
}
