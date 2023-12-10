import SPLRepository from "../repositories/SPLRepository.js";
import CustomError from "../utils/CustomError.js";
import PresentationRepository from "../repositories/PresentationRepository.js";
import StudentRepository from "../repositories/StudentRepository.js";

async function createPresentationEvent(data) {
    const { splId, presentationNo } = data;
    const spl = await SPLRepository.findById(splId);
    if (!spl) throw new CustomError("SPL does not exist", 400);

    const presentation = await PresentationRepository.findPresentation(splId, presentationNo);
    if (presentation) throw new CustomError(`Presentation ${presentationNo} already exists`, 400);

    // create
    await PresentationRepository.createPresentation(data);

    // notify corresponding users(committeeMembers, students under spl)
}

async function addPresentationMark(teacherId, presentationId) {
    const presentation = await PresentationRepository.findById(presentationId);
    if (!presentation) throw new CustomError("Presentation does not exist", 400);

    const created = await PresentationRepository.isPresentationMarkCreated(teacherId, presentationId);
    if (created) throw new CustomError("Mark is already added for that presentation");

    const studentIds = await StudentRepository.findAllStudentIdUnderSPL(presentation.splId);

    const marks = [];
    for (const studentId of studentIds) {
        marks.push({ studentId, teacherId, presentationId });
    }
    await PresentationRepository.createPresentationMark(marks);
}

export default {
    createPresentationEvent,
    addPresentationMark,
};
