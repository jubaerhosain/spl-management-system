import fs from "fs";
import path from "path";
import { sequelize, models, Op } from "../database/db.js";
import { generateHashedPassword } from "../utilities/password-utilities.js";
import { writeCredentials } from "../utilities/file-utilities.js";

export async function addStudent(req, res, next) {
    try {
        const { students } = req.body;

        const hashedPasswords = await generateHashedPassword(students.length);

        const credentials = [];
        for (const i in students) {
            students[i].password = hashedPasswords[i].hashedPassword;
            students[i].userType = "student";
            credentials.push({
                name: students[i].name,
                email: students[i].email,
                password: hashedPasswords[i].originalPassword,
            });
        }

        const transaction = await sequelize.transaction();
        try {
            res.status(200).json({
                message: "add student message",
            });

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
