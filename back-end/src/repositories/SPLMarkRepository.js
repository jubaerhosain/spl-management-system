import { models } from "../configs/mysql.js";

async function updateSupervisorMark(splId, marks) {
    marks = marks.map((mark) => {
        mark.splId = splId;
        return mark;
    });
    models.StudentSPL.bulkCreate(marks, { updateOnDuplicate: ["splId", "studentId", "supervisorMark"] });
}

async function updateCodingMark(splId, marks) {
    marks = marks.map((mark) => {
        mark.splId = splId;
        return mark;
    });
    models.StudentSPL.bulkCreate(marks, { updateOnDuplicate: ["splId", "studentId", "codingMark"] });
}

async function createContinuousClassWithMark(splId, classNo, studentIds) {
    const continuousMarks = [];
    studentIds.forEach((studentId) => {
        continuousMarks.push({
            splId,
            classNo,
            studentId,
        });
    });
    await models.ContinuousMark.bulkCreate(continuousMarks);
}

async function findContinuousClass(splId, classNo) {
    const continuousClass = await models.ContinuousMark.findOne({ where: { splId, classNo }, raw: true });
    return continuousClass;
}

export default {
    updateSupervisorMark,
    updateCodingMark,
    findContinuousClass,
    createContinuousClassWithMark,
};
