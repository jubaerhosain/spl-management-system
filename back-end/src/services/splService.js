import NotificationRepository from "../repositories/NotificationRepository.js";
import SPLRepository from "../repositories/SPLRepository.js";
import StudentRepository from "../repositories/StudentRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import TeacherRepository from "../repositories/TeacherRepository.js";
import CustomError from "../utils/CustomError.js";
import splUtils from "../utils/splUtils.js";
import lodash from "lodash";
// import emailService from "../emailServices/emailService.js";

async function createSPL(data) {
    const spl = await SPLRepository.findSPLByNameAndYear(data.splName, data.academicYear);
    if (spl) {
        throw new CustomError(`${data.splName} ${data.academicYear} already exists`, 400);
    }

    await SPLRepository.createSPL(data);
}

async function assignStudentsToSPL(splId) {
    const spl = await SPLRepository.findById(splId);
    if (!spl) {
        throw new CustomError("spl does not exist", 400);
    }

    const curriculumYear = splUtils.getCurriculumYear(spl.splName);

    const unassignedStudents = await StudentRepository.findAllStudentNotUnderSPL(spl.splId, curriculumYear);

    if (unassignedStudents.length <= 0) {
        throw new CustomError(`There is no ${curriculumYear} year student to assign to ${spl.splName}, ${spl.academicYear}`, 400);
    }

    const unassignedStudentIds = unassignedStudents.map((student) => student.studentId);
    await SPLRepository.assignStudents(spl.splId, unassignedStudentIds);

    const notifications = [];
    unassignedStudents.map((student) => {
        const notification = {
            userId: student.studentId,
            content: `You have assigned to ${spl.splName}, ${spl.academicYear}.`,
            type: "info",
        };
        notifications.push(notification);
    });

    await NotificationRepository.createMultipleNotification(notifications);

    // emailService.sendSPLAssignedEmail(unassignedStudentEmails, spl.splName, spl.academicYear);
}

async function getAllStudentUnderSPL(splId) {
    const students = await StudentRepository.findAllStudentUnderSPL(splId);
    return students;
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
    assignStudentsToSPL,
    getAllStudentUnderSPL,
    removeStudentFromSPL,
    randomizeSupervisor,
};
