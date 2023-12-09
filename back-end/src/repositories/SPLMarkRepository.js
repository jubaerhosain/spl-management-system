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

export default {
    updateSupervisorMark,
    updateCodingMark,
};
