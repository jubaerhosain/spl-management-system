import SPLRepository from "../repositories/SPLRepository.js";
import StudentRepository from "../repositories/StudentRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import CustomError from "../utils/CustomError.js";
import splUtils from "../utils/splUtils.js";
import emailService from "./emailServices/emailService.js";

async function createSPLCommittee(committee) {
    // find id's of corresponding email
    const committeeHeadId = await UserRepository.findUserIdByEmail(committee.committeeHeadEmail);
    const splManagerId = await UserRepository.findUserIdByEmail(committee.splManagerEmail);
    const committeeMemberIds = await UserRepository.findAllUserIdByEmail(
        committee.committeeMemberEmails
    );

    await SPLRepository.create({
        splName: committee.splName,
        academicYear: committee.academicYear,
        committeeHeadId,
        splManagerId,
        committeeMemberIds,
    });

    // send email to the committeeHead, SPL Manager, members
    // intentionally without await
    emailService.sendCommitteeCreationEmailToHead(
        committee.committeeHeadEmail,
        committee.splName,
        committee.academicYear
    );

    emailService.sendCommitteeCreationEmailToManager(
        committee.splManagerEmail,
        committee.splName,
        committee.academicYear
    );

    emailService.sendCommitteeCreationEmailToMembers(
        committee.committeeMemberEmails,
        committee.splName,
        committee.academicYear
    );
}

async function assignMultipleStudent(splName) {
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

    await SPLRepository.assignMultipleStudent(spl, unassignedStudentIds, unassignedStudentEmails);
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
    assignMultipleStudent,
    unassignStudent,
};
