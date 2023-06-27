import passwordUtils from "../utils/passwordUtils.js";
import fileUtils from "../utils/fileUtils.js";
import CustomError from "../utils/CustomError.js";
import TeacherRepository from "../repositories/TeacherRepository.js";
import emailService from "./emailServices/emailService.js";

async function createTeacherAccount(teachers) {
    const passwords = await passwordUtils.generateHashedPassword(teachers.length);

    const credentials = [];

    const users = teachers.map((teacher, i) => {
        const user = {};

        user.name = teacher.name;
        user.email = teacher.email;
        user.password = passwords[i].hashedPassword;
        user.userType = "teacher";

        delete teacher.name;
        delete teacher.email;

        user.Teacher = [teacher];

        credentials.push({
            name: user.name,
            email: user.email,
            password: passwords[i].originalPassword,
        });

        return user;
    });

    await TeacherRepository.create(users);

    try {
        await emailService.sendAccountCreationEmail(credentials);
    } catch (err) {
        console.log(err);
        throw new CustomError(
            "Accounts are created successfully but failed to send email with credential",
            200
        );
    }

    fileUtils.writeCredentials(new Date() + "\n" + JSON.stringify(credentials));
}

async function updateTeacherAccount(userId, teacher) {
    await TeacherRepository.update(userId, teacher);
}

export default {
    createTeacherAccount,
    updateTeacherAccount,
};
