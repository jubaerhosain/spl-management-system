import StudentRepository from "../repositories/StudentRepository.js";
import passwordUtils from "../utils/passwordUtils.js";
import fileUtils from "../utils/fileUtils.js";
import CustomError from "../utils/CustomError.js";
import UserRepository from "../repositories/UserRepository.js";
import emailService from "./emailServices/emailService.js";

async function createStudentAccount(students) {
    const passwords = await passwordUtils.generateHashedPassword(students.length);

    const credentials = [];

    // normalize students to add both to User and Student table in a single query
    let users = students.map((student, i) => {
        const user = {};

        user.name = student.name;
        user.email = student.email;
        user.password = passwords[i].hashedPassword;
        user.userType = "student";

        delete student.name;
        delete student.email;

        user.Student = [student];

        credentials.push({
            name: user.name,
            email: user.email,
            password: passwords[i].originalPassword,
        });

        return user;
    });

    await StudentRepository.create(users);

    await emailService.sendAccountCreationEmail(credentials);

    fileUtils.writeCredentials(new Date() + "\n" + JSON.stringify(credentials));
}

async function updateStudentAccount(userId, student) {
    // update in user table [only those fields are allowed]
    await UserRepository.updateAccount(userId, student);
}

async function updateStudentAccountByAdmin(studentId, student) {
    const exist = await UserRepository.isStudentById(studentId);

    if (!exist) {
        throw new CustomError("Student does not exist", 200);
    }

    // update to Student table [only those fields are allowed]
    await StudentRepository.update(studentId, student);
}

export default {
    createStudentAccount,
    updateStudentAccount,
    updateStudentAccountByAdmin,
};
