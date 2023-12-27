import { models } from "../configs/mysql.js";
import Student from "../models/Student.js";

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
    const evaluators = await models.PresentationTeacher_Evaluator.findAll({ where: { presentationId } });
    if (evaluators.length == 0) return [];
    return evaluators.map((evaluator) => evaluator.teacherId);
}

async function findById(presentationId, options) {
    const includes = [];
    if (options?.spl) includes.push(models.SPL);
    if (options?.evaluator) {
        const includeTeacher = {
            model: models.Teacher,
            as: "PresentationEvaluators",
            include: {
                model: models.User,
            },
            through: {
                model: models.PresentationTeacher_Evaluator,
                attributes: [],
            },
            attributes: {
                exclude: ["teacherId"],
            },
        };
        includes.push(includeTeacher);
    }

    let presentation = await models.Presentation.findOne({
        include: includes,
        where: { presentationId },
    });

    if (!options?.evaluator) return presentation;

    presentation = presentation.dataValues;

    const PresentationEvaluators = presentation.PresentationEvaluators;
    presentation.PresentationEvaluators = [];
    PresentationEvaluators.forEach((evaluator) => {
        evaluator = evaluator.dataValues;
        const user = evaluator.User.dataValues;
        delete evaluator.User.dataValues;
        presentation.PresentationEvaluators.push({ ...user, ...evaluator });
    });

    return presentation;
}

async function isPresentationMarkCreated(teacherId, presentationId) {
    const mark = await models.PresentationMark.findOne({ where: { presentationId, teacherId } });
    return mark ? true : false;
}

async function createPresentationMark(marks) {
    await models.PresentationMark.bulkCreate(marks);
}

async function findAllPresentationMark(presentationId) {
    const marks = await models.PresentationMark.findAll({
        where: { presentationId },
    });
    return marks;
}

async function findAllPresentationMarkGivenByEvaluator(evaluatorId, presentationId) {
    let marks = await models.PresentationMark.findAll({
        include: {
            model: models.Student,
            include: {
                model: models.User,
            },
            attributes: {
                exclude: ["studentId"],
            },
        },
        where: { presentationId, teacherId: evaluatorId },
        raw: true,
        nest: true,
    });

    marks = marks.map((mark) => {
        const user = mark.Student.User;
        delete mark.Student.User;
        mark.Student = { ...user, ...mark.Student };
        return mark;
    });

    return marks;
}

async function updatePresentationMark(marks) {
    await models.PresentationMark.bulkCreate(marks, {
        updateOnDuplicate: ["presentationMarkId", "presentationId", "studentId", "teacherId", "mark"],
    });
}

async function createPresentationEvaluator(evaluators) {
    console.log(evaluators);
    await models.PresentationTeacher_Evaluator.bulkCreate(evaluators);
}

async function deletePresentationEvaluator(presentationId, teacherId) {
    await models.PresentationTeacher_Evaluator.delete({ where: { presentationId, teacherId } });
}

async function isPresentationEvaluator(teacherId, presentationId) {
    const evaluator = await models.PresentationTeacher_Evaluator.findOne({ where: { teacherId, presentationId } });
    return evaluator ? true : false;
}

async function findAllExistedPresentationMark(markIds) {
    const marks = await models.PresentationMark.findAll({
        where: {
            PresentationMarkId: {
                [Op.in]: markIds,
            },
        },
        raw: true,
    });
    return marks;
}

export default {
    create,
    update,
    findById,
    findPresentation,
    findAllPresentationUnderSPL,
    findAllEvaluatorId,
    createPresentationMark,
    findAllPresentationMark,
    findAllPresentationMarkGivenByEvaluator,
    updatePresentationMark,
    createPresentationEvaluator,
    deletePresentationEvaluator,

    // utility methods
    isPresentationMarkCreated,
    isPresentationEvaluator,
    findAllExistedPresentationMark,
};
