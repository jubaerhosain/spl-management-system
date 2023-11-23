import StudentRepository from "../repositories/StudentRepository.js";
import passwordUtils from "../utils/passwordUtils.js";
import CustomError from "../utils/CustomError.js";
import UserRepository from "../repositories/UserRepository.js";
import emailService from "./emailServices/emailService.js";
import fileUtils from "../utils/fileUtils.js";

async function createStudentAccount(students) {
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
        emailService.sendAccountCreationEmail(credentials);
    } catch (err) {
        console.log(err);
        console.log("Accounts are created successfully but failed to send email with credential");
    }

    try {
        fileUtils.writeCredentials(new Date() + "\n" + JSON.stringify(credentials));
    } catch (err) {
        console.log(err);
        console.log("Accounts are created successfully but failed to write credentials in file");
    }
}

async function updateStudentAccount(userId, student) {
    // update in user table [only those fields are allowed]
    await UserRepository.updateAccount(userId, student);
}

async function updateStudentAccountByAdmin(studentId, student) {
    // check roll and registration number existence
    // if same as the current student then no need to throw error
    const { rollNo, registrationNo } = student;
    const error = {};
    if (rollNo) {
        const info = await StudentRepository.findByRoll(rollNo);
        if (info && info.studentId != studentId) {
            error["rollNo"] = {
                msg: "rollNo already exists",
                value: rollNo,
            };
        }
    }
    if (registrationNo) {
        const info = await StudentRepository.findByRegistration(registrationNo);
        if (info && info.studentId != studentId) {
            error["registrationNo"] = {
                msg: "registrationNo already exists",
                value: registrationNo,
            };
        }
    }

    if (Object.keys(error).length > 0) throw new CustomError("invalid data", 400, error);

    // update to Student table [only those fields are allowed]
    await StudentRepository.update(studentId, student);
}

export default {
    createStudentAccount,
    updateStudentAccount,
    updateStudentAccountByAdmin,
};
