import SPLRepository from "../repositories/SPLRepository.js";
import CustomError from "../utils/CustomError.js";
import PresentationRepository from "../repositories/PresentationRepository.js";
import StudentRepository from "../repositories/StudentRepository.js";
import TeacherRepository from "../repositories/TeacherRepository.js";
import utils from "../utils/utils.js";

async function createPresentation(data) {
    const { splId, presentationNo } = data;
    const spl = await SPLRepository.findById(splId);
    if (!spl) throw new CustomError("SPL does not exist", 400);

    const presentation = await PresentationRepository.findPresentation(splId, presentationNo);
    if (presentation) throw new CustomError(`Presentation ${presentationNo} already exists`, 400);

    // create
    await PresentationRepository.create(data);

    // notify corresponding users(committeeMembers, students under spl)
}

async function getPresentation(presentationId, options) {
    const presentation = await PresentationRepository.findById(presentationId, options);
    return presentation;
}

async function addPresentationMark(teacherId, presentationId) {
    const isPresentationEvaluator = await PresentationRepository.isPresentationEvaluator(teacherId, presentationId);
    if (!isPresentationEvaluator) throw new CustomError("You are not the evaluator of that presentation", 403);

    const presentation = await PresentationRepository.findById(presentationId);
    if (!presentation) throw new CustomError("Presentation does not exist", 400);

    // add a logic for eventDate is correct or not to add marks

    const created = await PresentationRepository.isPresentationMarkCreated(teacherId, presentationId);
    if (created) throw new CustomError("Mark is already added for that presentation");

    const studentIds = await StudentRepository.findAllStudentIdUnderSPL(presentation.splId);

    const marks = [];
    for (const studentId of studentIds) {
        marks.push({ studentId, teacherId, presentationId });
    }
    await PresentationRepository.createPresentationMark(marks);
}

async function getAllPresentationMark(teacherId, presentationId, options) {
    let marks = [];
    if (options?.forEvaluator) {
        // validate evaluator

        marks = await PresentationRepository.findAllPresentationMarkGivenByEvaluator(teacherId, presentationId);
    } else {
        // is manager | committeeHead, member....
        marks = await PresentationRepository.findAllPresentationMark(presentationId);
    }

    return marks;
}

async function updatePresentationMark(teacherId, presentationId, marks) {
    const presentation = await PresentationRepository.findById(presentationId);
    if (!presentation) throw new CustomError("Presentation does not exist", 400);

    // add a logic for eventDate is correct or not to add marks

    const existedPresentationMarks = PresentationRepository.findAllExistedPresentationMark(
        marks.map((mark) => mark.presentationMarkId)
    );

    // is given by teacher, is student ids are correct
    const validatePresentationMark = () => {};

    const presentationMarks = [];

    await PresentationRepository.updatePresentationMark(marks);
}

async function addPresentationEvaluator(presentationId, evaluators) {
    const presentation = await PresentationRepository.findById(presentationId);
    if (!presentation) throw new CustomError("Presentation does not exist", 400);

    const teachers = await TeacherRepository.findAllExistedTeacherByEmail(
        evaluators.map((evaluator) => evaluator.email)
    );

    const findTeacherId = (email) => {
        for (const teacher of teachers) {
            if (teacher.email == email) return teacher.userId;
        }
        return null;
    };

    evaluators = evaluators.map((evaluator) => {
        return {
            email: evaluator.email,
            teacherId: findTeacherId(evaluator.email),
        };
    });

    const validateTeacher = (evaluators) => {
        const error = {};
        evaluators.forEach((evaluator, index) => {
            if (!evaluator.teacherId) {
                error[`evaluators[${index}].email`] = {
                    msg: "evaluator must be a teacher",
                    value: evaluator.email,
                };
            }
        });

        if (utils.isObjectEmpty(error)) return null;
        return error;
    };

    let err = validateTeacher(evaluators);
    if (err) throw new CustomError("Presentation evaluators must be teacher", 400, err);

    const existingEvaluatorIds = await PresentationRepository.findAllEvaluatorId(presentationId);

    const validateExistingEvaluator = (evaluators) => {
        const error = {};
        evaluators.forEach((evaluator, index) => {
            if (existingEvaluatorIds.includes(evaluator.teacherId)) {
                error[`evaluators[${index}].email`] = {
                    msg: "already evaluator of that presentation",
                    value: evaluator.email,
                };
            }
        });

        if (utils.isObjectEmpty(error)) return null;
        return error;
    };

    err = validateExistingEvaluator(evaluators);
    if (err) throw new CustomError("Already evaluator of that presentation", 400, err);

    const evaluatorsWithId = [];
    teachers.forEach((teacher) => {
        evaluatorsWithId.push({
            teacherId: teacher.userId,
            presentationId,
        });
    });

    await PresentationRepository.createPresentationEvaluator(evaluatorsWithId);
}

async function removePresentationEvaluator(presentationId, evaluatorId) {
    await PresentationRepository.deletePresentationEvaluator(presentationId, evaluatorId);
}

export default {
    createPresentation,
    getPresentation,
    addPresentationMark,
    getAllPresentationMark,
    updatePresentationMark,
    addPresentationEvaluator,
    removePresentationEvaluator,
};
