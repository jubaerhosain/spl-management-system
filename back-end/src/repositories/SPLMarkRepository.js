import { models } from "../configs/mysql.js";

async function updateSupervisorMark(marks) {
    models.SPLMark.bulkCreate(marks, { updateOnDuplicate: ["splId", "studentId", "supervisorMark"] });
}

async function updateCodingMark(marks) {
    models.SPLMark.bulkCreate(marks, { updateOnDuplicate: ["splId", "studentId", "codingMark"] });
}

async function createContinuousClassWithMark(continuousMarks) {
    await models.ContinuousMark.bulkCreate(continuousMarks);
}

async function isContinuousClassExist(splId, classNo) {
    const continuousClass = await models.ContinuousMark.findOne({ where: { splId, classNo }, raw: true });
    return continuousClass;
}

export default {
    updateSupervisorMark,
    updateCodingMark,
    isContinuousClassExist,
    createContinuousClassWithMark,
};
