import passwordUtils from "../utils/passwordUtils.js";
import fileUtils from "../utils/fileUtils.js";
import CustomError from "../utils/CustomError.js";
import TeacherRepository from "../repositories/TeacherRepository.js";

async function addTeacher(teachers) {
    try {
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

        // moved email service to the repository for transaction
        await TeacherRepository.create(users, credentials);

        // write credentials to the file
        fileUtils.writeCredentials(new Date() + "\n" + JSON.stringify(credentials));
    } catch (err) {
        console.log(err);
        throw new CustomError(err.message);
    }
}

export default {
    addTeacher,
};
