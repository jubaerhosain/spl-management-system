import passwordUtils from "../utils/passwordUtils.js";
import UserRepository from "../repositories/UserRepository.js";
import TeacherRepository from "../repositories/TeacherRepository.js";
import TeamRepository from "../repositories/TeamRepository.js";
import ProjectRepository from "../repositories/ProjectRepository.js";
import StudentRepository from "../repositories/StudentRepository.js";
import SupervisorRequestRepository from "../repositories/SupervisorRequestRepository.js";
import emailUtils from "../utils/email/emailUtils.js";
import fileUtils from "../utils/fileUtils.js";
import CustomError from "../utils/CustomError.js";

async function createTeacher(teachers) {
    const validateExistence = async (teachers) => {
        const error = {};
        const existedEmails = await UserRepository.findAllExistedEmail(teachers.map((teacher) => teacher.email));
        teachers.forEach((teacher, index) => {
            if (existedEmails.includes(teacher.email)) {
                error[`teachers[${index}].email`] = {
                    msg: "email already exists",
                    value: teacher.email,
                };
            }
        });

        if (Object.keys(error).length === 0) return null;

        return error;
    };

    const error = await validateExistence(teachers);
    if (error) throw new CustomError("Existed emails are not allowed", 400, error);

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

    await TeacherRepository.create(newTeachers);

    try {
        // handle error inside called function
        await emailUtils.sendAccountCreationEmail(credentials);
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

async function updateTeacher(teacherId, teacher) {
    await TeacherRepository.update(teacherId, teacher);
}

async function getTeacher(teacherId) {
    const teacher = await TeacherRepository.findById(teacherId);
    return teacher;
}

async function getAllTeacher(options) {
    const teachers = await TeacherRepository.findAll(options);
    return teachers;
}

async function getAllStudentUnderSupervision(teacherId, options) {
    const students = await StudentRepository.findAllStudentUnderSupervisor(teacherId, options);
    return students;
}

async function getAllTeamUnderSupervision(teacherId, options) {
    const teams = await TeamRepository.findAllTeamUnderSupervisor(teacherId, options);
    return teams;
}

async function getAllProjectUnderSupervision(teacherId, options) {
    const projects = await ProjectRepository.findAllProjectUnderSupervisor(teacherId, options);
    return projects;
}

async function getAllSupervisorRequest(teacherId) {
    const requests = await SupervisorRequestRepository.findAllSupervisorRequest(teacherId);
    return requests;
}

async function acceptSupervisorRequest(teacherId, requestId) {
    const request = await SupervisorRequestRepository.findById(requestId);
    if (!request) throw new CustomError("Invalid request", 400);

    if (request.teacherId != teacherId) throw new CustomError("Unauthorized request", 401);

    if (request.studentId) {
        const isSupervisorExist = await StudentRepository.isSupervisorExist(request.studentId, request.splId);
        if (isSupervisorExist) throw new CustomError("Supervisor already assigned for that student", 400);

        await StudentRepository.addSupervisor(request.studentId, teacherId, request.splId);

        await SupervisorRequestRepository.deleteAllStudentRequest(request.studentId);
    } else if (request.teamId) {
        const isSupervisorExist = await TeamRepository.isSupervisorExist(request.teamId);
        if (isSupervisorExist) throw new CustomError("Supervisor already assigned for that team", 400);

        const teamMembers = await TeamRepository.findAllTeamMember(request.teamId);
        const teamMemberIds = teamMembers.map((student) => student.userId);
        await TeamRepository.addSupervisor(request.teamId, teacherId, request.splId, teamMemberIds);

        await SupervisorRequestRepository.deleteAllStudentRequest(request.studentId);
    }
}

export default {
    createTeacher,
    updateTeacher,
    getTeacher,
    getAllTeacher,
    getAllStudentUnderSupervision,
    getAllTeamUnderSupervision,
    getAllProjectUnderSupervision,
    getAllSupervisorRequest,
    acceptSupervisorRequest,
};
