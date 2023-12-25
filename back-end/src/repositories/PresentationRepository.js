import { models } from "../configs/mysql.js";

async function create(presentation) {
    await models.Presentation.create(presentation);
}

async function update(presentationId, presentation) {}

async function findPresentation(splId, presentationNo) {
    const presentation = await models.Presentation.findOne({
        where: {
            splId,
            presentationNo,
        },
    });
    return presentation;
}

async function findAllPresentationUnderSPL(splId) {
    const presentations = await models.Presentation.findAll({
        where: splId,
        raw: true,
        order: [["presentationNo", "ASC"]],
    });
    return presentations;
}

async function findAllEvaluatorId(presentationId) {
    const evaluators = await models.PresentationEvaluator.findAll({ where: { presentationId } });
    if (evaluators.length == 0) return [];
    return evaluators.map((evaluator) => evaluator.teacherId);
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

async function updatePresentationMark(marks) {
    await models.PresentationMark.bulkCreate(marks, {
        updateOnDuplicate: ["presentationMarkId", "presentationId", "studentId", "teacherId", "mark"],
    });
}

async function createPresentationEvaluator(evaluators) {
    await models.PresentationEvaluator.bulkCreate(evaluators);
}

async function deletePresentationEvaluator(presentationId, teacherId) {
    await models.PresentationEvaluator.delete({ where: { presentationId, teacherId } });
}

export default {
    create,
    update,
    findById,
    findPresentation,
    findAllPresentationUnderSPL,
    findAllEvaluatorId,
    isPresentationMarkCreated,
    createPresentationMark,
    updatePresentationMark,
    createPresentationEvaluator,
    deletePresentationEvaluator,
};
