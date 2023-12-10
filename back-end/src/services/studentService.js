import StudentRepository from "../repositories/StudentRepository.js";
import TeacherRepository from "../repositories/TeacherRepository.js";
import passwordUtils from "../utils/passwordUtils.js";
import CustomError from "../utils/CustomError.js";
import SPLRepository from "../repositories/SPLRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import emailService from "../utils/email/emailUtils.js";
import fileUtils from "../utils/fileUtils.js";

async function createStudent(students) {
    const validateExistence = async (students) => {
        const error = {};
        const existedEmails = await UserRepository.findAllExistedEmail(students.map((student) => student.email));
        const existedRollNos = await StudentRepository.findAllExistedRollNo(students.map((student) => student.rollNo));
        const existedRegistrationNos = await StudentRepository.findAllExistedRegistrationNo(
            students.map((student) => student.registrationNo)
        );
        students.forEach((student, index) => {
            if (existedEmails.includes(student.email)) {
                error[`students[${index}].email`] = {
                    msg: "email already exists",
                    value: student.email,
                };
            }
            if (existedRollNos.includes(student.rollNo)) {
                error[`students[${index}].rollNo`] = {
                    msg: "rollNo already exists",
                    value: student.rollNo,
                };
            }
            if (existedRegistrationNos.includes(student.registrationNo)) {
                error[`students[${index}].registrationNo`] = {
                    msg: "registrationNo already exists",
                    value: student.registrationNo,
                };
            }
        });

        if (Object.keys(error).length === 0) return null;

        return error;
    };

    const error = await validateExistence(students);
    if (error) throw new CustomError("Existed email, roll, registration are not allowed", 400, error);

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

    await StudentRepository.createStudent(newStudents);

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

async function getStudent(studentId) {
    const student = await StudentRepository.findById(studentId);
    return student;
}

async function getAllStudent(options) {
    // options { page=10, count=10 } etc
    const students = await StudentRepository.findAll();
    return students;
}

async function getAllStudentByCurriculumYear(curriculumYear) {
    const students = await StudentRepository.findAllByCurriculumYear(curriculumYear);
    return students;
}

async function updateStudent(userId, student) {
    // update in user table [only those fields are allowed]
    await UserRepository.update(userId, student);
}

async function updateStudentByAdmin(studentId, student) {
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
    await StudentRepository.updateByAdmin(studentId, student);
}

async function requestTeacher(studentId, teacherId) {
    const student = await StudentRepository.findById(studentId);
    if (student.curriculumYear != "4th") throw new CustomError("Only 4th year student can request for supervisor", 400);

    const request = await StudentRepository.findStudentRequest(studentId, teacherId);
    if (request) throw new CustomError("Request already sent", 400);

    const currentSPL = await SPLRepository.findCurrentActiveSPL(studentId);
    if (!currentSPL || currentSPL.splName != "spl3") throw new CustomError("You are not assigned to spl3", 400);

    const currentSupervisor = await StudentRepository.findSupervisorId(studentId, currentSPL.splId);
    if (currentSupervisor) throw new CustomError("Already have supervisor");

    const availableTeacher = await TeacherRepository.findAvailableTeacher(teacherId);
    if (!availableTeacher) throw new CustomError("Teacher is not available to be supervisor", 400);

    await StudentRepository.createStudentRequest(studentId, teacherId, currentSPL.splId);
}

async function getStudentRequest() {
    // if a teacher requested this student or not providing teacherId
}

async function getAllStudentRequest() {}
async function deleteStudentRequest() {}

async function getAllSPL(studentId) {
    const spls = await SPLRepository.findAllSPLByStudentId(studentId);
    return spls;
}

async function getCurrentSPL(studentId) {
    const spl = await SPLRepository.findActiveSPLByStudentId(studentId);
    return spl;
}

async function assignSupervisorToStudent(splId, studentId, teacherId) {
    // check if already have supervisor or not for that spl
    const supervisor = await StudentRepository.findSupervisorId(studentId, splId);
    if (supervisor) throw new CustomError("Already have supervisor for this spl", 400);

    const spl = await SPLRepository.findCurrentActiveSPL(studentId);
    if (!spl) throw new CustomError("Student is not assigned to this spl", 400);

    const availableTeacher = await TeacherRepository.findAvailableTeacher(teacherId);
    if (!availableTeacher) throw new CustomError("Teacher is not available to be supervisor", 400);

    await StudentRepository.createStudentSupervisor(studentId, teacherId, splId);
}

export default {
    createStudent,
    getStudent,
    getAllStudent,
    getAllStudentByCurriculumYear,
    updateStudent,
    updateStudentByAdmin,
    requestTeacher,
    getStudentRequest,
    getAllStudentRequest,
    deleteStudentRequest,
    getAllSPL,
    getCurrentSPL,
    assignSupervisorToStudent,
};
