import { models } from "../configs/mysql.js";

async function createPresentation(presentation) {
    await models.Presentation.create(presentation);
}

async function findPresentation(splId, presentationNo) {
    const presentation = await models.Presentation.findOne({
        where: {
            splId,
            presentationNo,
        },
    });
    return presentation;
}

async function findById(presentationId) {
    const presentation = await models.Presentation.findOne({ where: { presentationId } });
    return presentation;
}

async function isPresentationMarkCreated(teacherId, presentationId) {
    const mark = await models.PresentationMark.findOne({ where: { presentationId, teacherId } });
    return mark;
}

async function createPresentationMark(marks) {
    await models.PresentationMark.bulkCreate(marks);
}

export default {
    createPresentation,
    findPresentation,
    findById,
    isPresentationMarkCreated,
    createPresentationMark,
};
