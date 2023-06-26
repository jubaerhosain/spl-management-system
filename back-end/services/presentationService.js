import SPLRepository from "../repositories/SPLRepository.js";
import CustomError from "../utils/CustomError.js";

async function createPresentationEvent(splId) {
    const spl = await SPLRepository.findById(splId);

    if (!spl) {
        throw new CustomError("SPL does not exist", 400);
    }

    // create

    // push notification

    // send email
}

export default {
    createPresentationEvent,
};
