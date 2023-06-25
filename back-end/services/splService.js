import SPLRepository from "../repositories/SPLRepository.js";
import StudentRepository from "../repositories/StudentRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import CustomError from "../utils/CustomError.js";
import splUtils from "../utils/splUtils.js";
import emailService from "./emailServices/emailService.js";

async function createSPLCommittee(committee) {
    // find id's of corresponding email
    const headId = await UserRepository.findUserIdByEmail(committee.headEmail);
    const managerId = await UserRepository.findUserIdByEmail(committee.managerEmail);
    const memberIds = await UserRepository.findAllUserIdByEmail(committee.memberEmails);

    await SPLRepository.create({
        splName: committee.splName,
        academicYear: committee.academicYear,
        committeeHead: headId,
        splManager: managerId,
        memberIds: memberIds,
    });

    // intentionally without await
    emailService.sendCommitteeCreationEmailToHead(
        committee.headEmail,
        committee.splName,
        committee.academicYear
    );

    emailService.sendCommitteeCreationEmailToManager(
        committee.managerEmail,
        committee.splName,
        committee.academicYear
    );

    emailService.sendCommitteeCreationEmailToMembers(
        committee.memberEmails,
        committee.splName,
        committee.academicYear
    );
}

async function assignStudents(splName) {
    const curriculumYear = splUtils.getCurriculumYear(splName);

    const spl = await SPLRepository.findByName(splName);

    if (!spl) {
        throw new CustomError("SPL does not exist", 400);
    }

    const { unassignedStudentIds, unassignedStudentEmails } =
        await StudentRepository.findAllUnassignedStudentIdAndEmail(spl.splId, curriculumYear);

    if (unassignedStudentIds.length <= 0) {
        throw new CustomError(
            `There is no ${curriculumYear} year student to assign to ${splName.toUpperCase()}`,
            400
        );
    }

    await SPLRepository.assignStudents(spl.splId, unassignedStudentIds);

    await emailService.sendSPLAssignedEmail(unassignedStudentEmails, spl.splName, spl.academicYear);
}

async function unassignStudent(splId, studentId) {
    const belongs = await SPLRepository.isStudentBelongsToSPL(splId, studentId);
    if (!belongs) {
        throw new CustomError("Invalid student or spl", 400);
    }

    await SPLRepository.removeStudent(splId, studentId);
}

export default {
    createSPLCommittee,
    assignStudents,
    unassignStudent,
};
