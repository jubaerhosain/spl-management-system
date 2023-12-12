import SPLRepository from "../repositories/SPLRepository.js";
import CustomError from "../utils/CustomError.js";
import PresentationRepository from "../repositories/PresentationRepository.js";
import StudentRepository from "../repositories/StudentRepository.js";
import TeacherRepository from "../repositories/TeacherRepository.js";
import utils from "../utils/utils.js";

async function createPresentationEvent(data) {
    const { splId, presentationNo } = data;
    const spl = await SPLRepository.findById(splId);
    if (!spl) throw new CustomError("SPL does not exist", 400);

    const presentation = await PresentationRepository.findPresentation(splId, presentationNo);
    if (presentation) throw new CustomError(`Presentation ${presentationNo} already exists`, 400);

    // create
    await PresentationRepository.create(data);

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

async function updatePresentationMark(teacherId, presentationId, marks) {
    const presentation = await PresentationRepository.findById(presentationId);
    if (!presentation) throw new CustomError("Presentation does not exist", 400);

    const studentIds = await StudentRepository.findAllStudentIdUnderSPL(presentation.splId);
    for (const mark of marks) {
        if (mark.presentationId !== presentationId)
            throw new CustomError(
                `PresentationMarkId '${mark.presentationMarkId}' does not belongs to this presentation`,
                400
            );
        if (mark.teacherId !== teacherId)
            throw new CustomError(`PresentationMarkId '${mark.presentationMarkId}' does not belongs to you`, 400);
        if (!studentIds.includes(mark.studentId))
            throw new CustomError(`Student '${mark.studentId}' does not belong to this spl`, 400);
    }

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
            if (teacher.email == email) return teacher.teacherId;
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
            teacherId: teacher.teacherId,
            presentationId,
        });
    });

    await PresentationRepository.createPresentationEvaluator(evaluatorsWithId);
}

async function removePresentationEvaluator(presentationId, evaluatorId) {
    await PresentationRepository.deletePresentationEvaluator(presentationId, evaluatorId);
}

export default {
    createPresentationEvent,
    addPresentationMark,
    updatePresentationMark,
    addPresentationEvaluator,
    removePresentationEvaluator
};
