import NotificationRepository from "../repositories/NotificationRepository.js";
import SPLRepository from "../repositories/SPLRepository.js";
import StudentRepository from "../repositories/StudentRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import SPLMarkRepository from "../repositories/SPLMarkRepository.js";
import ProjectRepository from "../repositories/ProjectRepository.js";
import TeacherRepository from "../repositories/TeacherRepository.js";
import PresentationRepository from "../repositories/PresentationRepository.js";
import CustomError from "../utils/CustomError.js";
import splUtils from "../utils/splUtils.js";
import utils from "../utils/utils.js";
import lodash from "lodash";
// import emailService from "../emailServices/emailService.js";

async function createSPL(data) {
    const spl = await SPLRepository.findSPLByNameAndYear(data.splName, data.academicYear);
    if (spl) {
        throw new CustomError(`${data.splName} ${data.academicYear} already exists`, 400);
    }

    await SPLRepository.create(data);
}

async function getSPL(splId, options) {
    const spl = await SPLRepository.findById(splId, options);
    return spl;
}

async function getAllSPL(options) {
    const spls = await SPLRepository.findAll(options);
    return spls;
}

async function enrollStudent(splId, curriculumYear, students) {
    const spl = await SPLRepository.findById(splId);
    if (!spl) {
        throw new CustomError("spl does not exist", 400);
    }

    const actualCurriculumYear = splUtils.getCurriculumYear(spl.splName);
    if (curriculumYear != actualCurriculumYear) {
        throw new CustomError(`Only ${actualCurriculumYear} curriculum is year allowed`, 400);
    }

    const curriculumYearStudents = await StudentRepository.findAll({ curriculumYear });
    const isValidStudent = (studentId) => {
        for (const student of curriculumYearStudents) {
            if (student.userId == studentId) return true;
        }
        return false;
    };
    const validateStudent = (students) => {
        const error = {};
        students.forEach((student, index) => {
            if (!isValidStudent(student.studentId)) {
                error[`students[${index}].studentId`] = {
                    msg: `not a ${curriculumYear} year student`,
                    value: student.studentId,
                };
            }
        });
        if (utils.isObjectEmpty(error)) return null;
        return error;
    };
    let error = validateStudent(students);
    if (error) throw new CustomError("Invalid student", 400, error);

    const assignedStudentIds = await StudentRepository.findAllStudentIdUnderSPL(splId);
    const validateAlreadyEnrolled = (students) => {
        const error = {};
        students.forEach((student, index) => {
            if (assignedStudentIds.includes(student.studentId)) {
                error[`students[${index}].studentId`] = {
                    msg: `already enrolled to ${spl.splName}`,
                    value: student.studentId,
                };
            }
        });
        if (utils.isObjectEmpty(error)) return null;
        return error;
    };
    error = validateAlreadyEnrolled(students);
    if (error) throw new CustomError("Already enrolled to spl", 400, error);

    const unenrolledStudentIds = students.map((student) => student.studentId);
    await SPLRepository.enrollStudent(spl.splId, unenrolledStudentIds);

    const notifications = [];
    students.map((student) => {
        const notification = {
            userId: student.studentId,
            content: `You have enrolled to ${spl.splName}, ${spl.academicYear}.`,
            type: "info",
        };
        notifications.push(notification);
    });

    await NotificationRepository.createMultipleNotification(notifications);

    // emailService.sendSPLAssignedEmail(unassignedStudentEmails, spl.splName, spl.academicYear);
}

async function getAllStudentUnderSPL(splId, options) {
    const students = await StudentRepository.findAllStudentUnderSPL(splId, options);
    return students;
}

async function getAllProjectUnderSPL(splId, options) {
    const projects = await ProjectRepository.findAllProjectUnderSPL(splId, options);
    return projects;
}

async function getAllPresentationUnderSPL(splId) {
    const presentations = await PresentationRepository.findAllPresentationUnderSPL();
    return presentations;
}

async function removeStudentFromSPL(splId, studentId) {
    const belongs = await SPLRepository.isStudentBelongsToSPL(splId, studentId);
    if (!belongs) {
        throw new CustomError("Invalid student or spl", 400);
    }

    await SPLRepository.removeStudent(splId, studentId);
}

async function randomizeSupervisor(splId) {
    const spl = await SPLRepository.findById(splId);
    if (!spl) throw new CustomError("spl does not exist", 400);

    if (spl.splName != "spl1") throw new CustomError("randomization is only allowed for spl1", 400);

    const randomized = await SPLRepository.isSupervisorRandomized(splId);
    if (randomized) throw new CustomError(`Randomization already done for ${spl.splName}, ${spl.academicYear}.`, 400);

    const teachers = await TeacherRepository.findAllAvailableTeacher();
    const students = await StudentRepository.findAllStudentUnderSPL(splId);

    const randomize = (students, teachers) => {
        students = lodash.shuffle(students);
        teachers = lodash.shuffle(teachers);

        while (teachers.length < students.length) {
            teachers = teachers.concat(teachers);
        }

        const studentTeachers = [];
        for (let i = 0; i < students.length; i++) {
            studentTeachers.push({
                student: students[i],
                teacher: teachers[i],
            });
        }

        return studentTeachers;
    };

    const studentTeacher = randomize(students, teachers);

    const studentTeacherIds = studentTeacher.map((element) => {
        return {
            studentId: element.student.userId,
            teacherId: element.teacher.userId,
        };
    });

    await SPLRepository.createMultipleSupervisor(splId, studentTeacherIds);

    const notifications = [];
    studentTeacher.forEach((element) => {
        const { student, teacher } = element;
        const studentNotification = {
            userId: student.userId,
            content: `<b>${teacher.name}</b> has been assigned as your <b>Supervisor</b> for <b>${spl.splName}, ${spl.academicYear}.</b>`,
            type: "info",
        };
        const teacherNotification = {
            userId: teacher.userId,
            content: `You have been assigned as <b>Supervisor</b> of <b>${student.name}</b> for <b>${spl.splName}, ${spl.academicYear}.</b>`,
            type: "info",
        };
        notifications.push(studentNotification);
        notifications.push(teacherNotification);
    });

    await NotificationRepository.createMultipleNotification(notifications);
}

export default {
    createSPL,
    getSPL,
    getAllSPL,
    enrollStudent,
    getAllStudentUnderSPL,
    getAllProjectUnderSPL,
    getAllPresentationUnderSPL,
    removeStudentFromSPL,
    randomizeSupervisor,
};
