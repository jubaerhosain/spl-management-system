import StudentRepository from "../repositories/StudentRepository.js";
import passwordUtils from "../utils/passwordUtils.js";
import CustomError from "../utils/CustomError.js";
import UserRepository from "../repositories/UserRepository.js";

async function createStudentAccount(students) {

    // validate data existences

    const passwords = await passwordUtils.generatePassword(students.length);

    const credentials = [];

    // normalize students to add both to User and Student table in a single query
    const newStudents = students.map((student, i) => {
        const user = {};

        user.name = student.name;
        user.email = student.email;
        user.password = passwords[i].hash;
        user.userType = "student";

        delete student.name;
        delete student.email;

        user.Student = [student];

        credentials.push({
            name: user.name,
            email: user.email,
            password: passwords[i].original,
        });

        return user;
    });

    await StudentRepository.create(newStudents);

    try {
        await emailService.sendAccountCreationEmail(credentials);
    } catch (err) {
        console.log(err);
        throw new CustomError("Accounts are created successfully but failed to send email with credential", 400);
    }

    try {
        fileUtils.writeCredentials(new Date() + "\n" + JSON.stringify(credentials));
    } catch (err) {
        console.log(err);
        throw new CustomError("Accounts are created successfully but failed to write credentials in file ", 400);
    }

    return credentials;
}

async function updateStudentAccount(userId, student) {
    // update in user table [only those fields are allowed]
    await UserRepository.updateAccount(userId, student);
}

async function updateStudentAccountByAdmin(studentId, student) {
    const exist = await UserRepository.isStudentById(studentId);

    if (!exist) {
        throw new CustomError("Student does not exist", 400);
    }

    // update to Student table [only those fields are allowed]
    await StudentRepository.update(studentId, student);
}

export default {
    createStudentAccount,
    updateStudentAccount,
    updateStudentAccountByAdmin,
};
