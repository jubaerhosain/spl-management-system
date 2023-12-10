import SPLRepository from "../repositories/SPLRepository.js";
import StudentRepository from "../repositories/StudentRepository.js";
import SPLMarkRepository from "../repositories/SPLMarkRepository.js";
import CustomError from "../utils/CustomError.js";
import utils from "../utils/utils.js";

async function updateSupervisorMark(userId, splId, marks) {
    const spl = await SPLRepository.findById(splId);
    if (!spl) throw new CustomError("SPL does not exist", 400);

    if (!utils.isUnique(marks.map((mark) => mark.studentId)))
        throw new CustomError(`Duplicate studentId not allowed`, 400);

    const splStudentIds = await StudentRepository.findAllStudentIdUnderSPL(splId);
    for (const id of marks.map((mark) => mark.studentId)) {
        if (!splStudentIds.includes(id)) {
            throw new CustomError(`Student '${id}' does not under SPL`, 400);
        }
    }

    const supervisorStudentIds = await StudentRepository.findAllStudentIdUnderSupervisor(splId, userId);
    for (const id of marks.map((mark) => mark.studentId)) {
        if (!supervisorStudentIds.includes(id)) {
            throw new CustomError(`Student ${id} does not under Supervisor`, 400);
        }
    }

    const supervisorMarks = marks.map((mark) => {
        return {
            ...mark,
            splId,
        };
    });
    await SPLMarkRepository.updateSupervisorMark(supervisorMarks);
}

async function updateCodingMark(splId, marks) {
    const spl = await SPLRepository.findById(splId);
    if (!spl) throw new CustomError("SPL does not exist", 400);

    if (!utils.isUnique(marks.map((mark) => mark.studentId)))
        throw new CustomError(`Duplicate studentId not allowed`, 400);

    const splStudentIds = await StudentRepository.findAllStudentIdUnderSPL(splId);
    for (const id of marks.map((mark) => mark.studentId)) {
        if (!splStudentIds.includes(id)) {
            throw new CustomError(`Student '${id}' does not under SPL`, 400);
        }
    }

    const codingMarks = marks.map((mark) => {
        return {
            ...mark,
            splId,
        };
    });
    await SPLMarkRepository.updateCodingMark(codingMarks);
}

async function createContinuousClassWithMark(splId, classNo) {
    const spl = await SPLRepository.findById(splId);
    if (!spl) throw new CustomError("SPL does not exist", 400);

    const exist = await SPLMarkRepository.isContinuousClassExist(splId, classNo);
    if (exist) throw new CustomError(`Class ${classNo} already exists`, 400);

    const studentIds = await StudentRepository.findAllStudentIdUnderSPL(splId);

    const continuousMarks = [];
    studentIds.forEach((studentId) => {
        continuousMarks.push({
            splId,
            classNo,
            studentId,
        });
    });
    await SPLMarkRepository.createContinuousClassWithMark(continuousMarks);
}

async function updateContinuousClassNo(splId, oldClassNo, newClassNo) {}

async function updateContinuousMark(splId, marks) {}

export default {
    updateSupervisorMark,
    updateCodingMark,
    createContinuousClassWithMark,
    updateContinuousClassNo,
};
