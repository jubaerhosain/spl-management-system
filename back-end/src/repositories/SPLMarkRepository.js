import { models } from "../configs/mysql.js";

async function updateSupervisorMark(splId, marks) {
    marks = marks.map((mark) => {
        mark.splId = splId;
        return mark;
    });
    models.StudentSPL.bulkUpdate(marks, { updateOnDuplicate: ["splId", "studentId"] });
}

export default {
    updateSupervisorMark,
};
