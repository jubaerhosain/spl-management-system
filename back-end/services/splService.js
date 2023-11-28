import NotificationRepository from "../repositories/NotificationRepository.js";
import SPLRepository from "../repositories/SPLRepository.js";
import StudentRepository from "../repositories/StudentRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import CustomError from "../utils/CustomError.js";
import splUtils from "../utils/splUtils.js";
import emailService from "./emailServices/emailService.js";

async function createSPL(data) {
    const spl = await SPLRepository.findActiveSPLByName(data.splName);
    if (spl) {
        throw new CustomError(`${data.splName} already exists`, 400, {
            splName: {
                msg: `${data.splName} already exists`,
                value: data.splName,
            },
        });
    }

    await SPLRepository.create(data);
}

async function addCommitteeHead(splId, data) {
    const user = await UserRepository.findByEmail(data.email);
    if (!user || user.userType != "teacher") {
        throw new CustomError("Invalid email", 400, {
            email: {
                msg: "committee head must be a teacher",
                value: data.email,
            },
        });
    }

    const spl = await SPLRepository.findById(splId);
    if (spl?.head) {
        throw new CustomError("already have a committee head", 400);
    }

    const head = { head: user.userId };
    await SPLRepository.update(splId, head);

    const notification = {
        userId: user.userId,
        title: `Committee head ${spl.splName} ${spl.academicYear}`,
        content: `You have added as Committee head of ${spl.splName} ${spl.academicYear}`,
        type: "info",
    };

    await NotificationRepository.create(notification);
}

async function addSPLManager(splId, data) {
    const user = await UserRepository.findByEmail(data.email);
    if (!user || user.userType != "teacher") {
        throw new CustomError("Invalid email", 400, {
            email: {
                msg: "spl manager must be a teacher",
                value: data.email,
            },
        });
    }

    const spl = await SPLRepository.findById(splId);
    if (spl?.manager) {
        throw new CustomError("already have a spl manager", 400);
    }

    const manager = { manager: user.userId };
    await SPLRepository.update(splId, manager);

    const notification = {
        userId: user.userId,
        title: `SPL manager ${spl.splName} ${spl.academicYear}`,
        content: `You have added as spl manager of ${spl.splName} ${spl.academicYear}`,
        type: "info",
    };

    await NotificationRepository.create(notification);
}

async function assignStudents(splName) {
    const curriculumYear = splUtils.getCurriculumYear(splName);

    const spl = await SPLRepository.findByName(splName);

    if (!spl) {
        throw new CustomError("SPL does not exist", 400);
    }

    const { unassignedStudentIds, unassignedStudentEmails } = await StudentRepository.findAllUnassignedStudentIdAndEmail(
        spl.splId,
        curriculumYear
    );

    if (unassignedStudentIds.length <= 0) {
        throw new CustomError(`There is no ${curriculumYear} year student to assign to ${splName.toUpperCase()}`, 400);
    }

    await SPLRepository.assignStudents(spl.splId, unassignedStudentIds);

    await emailService.sendSPLAssignedEmail(unassignedStudentEmails, spl.splName, spl.academicYear);

    // push notification
}

async function unassignStudent(splId, studentId) {
    const belongs = await SPLRepository.isStudentBelongsToSPL(splId, studentId);
    if (!belongs) {
        throw new CustomError("Invalid student or spl", 400);
    }

    await SPLRepository.removeStudent(splId, studentId);
}

export default {
    createSPL,
    addCommitteeHead,
    addSPLManager,
    assignStudents,
    unassignStudent,
};
