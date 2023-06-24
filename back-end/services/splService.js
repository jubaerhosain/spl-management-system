import SPLRepository from "../repositories/SPLRepository.js";

async function createSPLCommittee(committee) {
    await SPLRepository.create(committee);

    // send email to the committeeHead, SPL Manager, members
}

export default {
    createSPLCommittee,
};
