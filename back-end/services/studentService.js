import StudentRepository from "../repositories/StudentRepository.js";
import passwordUtils from "../utils/passwordUtils.js";
import fileUtils from "../utils/fileUtils.js";
import emailService from "./emailServices/emailService.js";
import CustomError from "../utils/CustomError.js";
import UserRepository from "../repositories/UserRepository.js";

/**
 * Add one or more students
 * @param {Array} students
 */
async function addStudent(students) {
    try {
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

        // moved email service to the repository for transaction
        await StudentRepository.create(users, credentials);

        // write credentials to the file
        fileUtils.writeCredentials(new Date() + "\n" + JSON.stringify(credentials));
    } catch (err) {
        console.log(err);
        throw new CustomError(err.message);
    }
}

async function updateStudent(userId, student) {
    // update in user table [only those fields are allowed]
    await UserRepository.updateAccount(userId, student);
}

export default {
    addStudent,
    updateStudent,
};
