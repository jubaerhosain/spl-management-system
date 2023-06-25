import SPLRepository from "../repositories/SPLRepository.js";
import UserRepository from "../repositories/UserRepository.js";
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

export default {
    createSPLCommittee,
};
