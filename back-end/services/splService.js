import SPLRepository from "../repositories/SPLRepository.js";
import UserRepository from "../repositories/UserRepository.js";

async function createSPLCommittee(committee) {
    committee.committeeHead = await UserRepository.findUserIdByEmail(committee.committeeHead);
    committee.splManager = await UserRepository.findUserIdByEmail(committee.splManager);
    committee.committeeMembers = await UserRepository.findAllUserIdByEmail(committee.committeeMembers);

    await SPLRepository.create(committee);

    // send email to the committeeHead, SPL Manager, members
    console.log("Sending email");
}

export default {
    createSPLCommittee,
};
