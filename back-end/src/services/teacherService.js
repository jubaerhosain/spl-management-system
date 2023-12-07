import passwordUtils from "../utils/passwordUtils.js";
import TeacherRepository from "../repositories/TeacherRepository.js";
import emailUtils from "../utils/email/emailUtils.js";
import fileUtils from "../utils/fileUtils.js";

async function createTeacher(teachers) {
    const passwords = await passwordUtils.generatePassword(teachers.length);

    const credentials = [];

    // normalize teacher to add both to User and Teacher table in a single query
    const newTeachers = teachers.map((teacher, i) => {
        const user = {};

        user.name = teacher.name;
        user.email = teacher.email;
        user.password = passwords[i].hash;
        user.userType = "teacher";

        delete teacher.name;
        delete teacher.email;

        user.Teacher = [teacher];

        credentials.push({
            name: user.name,
            email: user.email,
            password: passwords[i].original,
        });

        return user;
    });

    await TeacherRepository.createTeacher(newTeachers);

    try {
        emailUtils.sendAccountCreationEmail(credentials);
    } catch (err) {
        console.log(err);
        console.log("Accounts are created successfully but failed to send email with credential");
    }

    try {
        fileUtils.writeCredentials(new Date() + "\n" + JSON.stringify(credentials));
    } catch (err) {
        console.log(err);
        console.log("Accounts are created successfully but failed to wrote credentials tp file");
    }
}

async function updateTeacher(userId, teacher) {
    await TeacherRepository.updateTeacher(userId, teacher);
}

export default {
    createTeacher,
    updateTeacher,
};
