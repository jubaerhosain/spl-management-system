import SPLRepository from "../repositories/SPLRepository.js";
import CustomError from "../utils/CustomError.js";
import PresentationRepository from "../repositories/PresentationRepository.js"

async function createPresentationEvent(data) {
    const {splId} = data;
    const spl = await SPLRepository.findById(splId);
    if (!spl) throw new CustomError("SPL does not exist", 400);

    const presentation = await PresentationRepository.findPresentation(data.splId, data.presentationNo);
    if(presentation) throw new CustomError(`Presentation ${data.presentationNo} already exists`, 400);

    // create
    await PresentationRepository.createPresentation(data);

    // notify corresponding users(committeeMembers, students under spl)
}

export default {
    createPresentationEvent,
};
