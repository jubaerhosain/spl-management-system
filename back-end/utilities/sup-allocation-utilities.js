import lodash from "lodash";

/**
 * Randomize supervisor for students
 * @param {Array} studentIds
 * @param {Array} teacherIds
 * @return {Promise<Array>} [{studentId, TeacherId}]
 */
function randomize(studentIds, teacherIds) {
    return new Promise(function (resolve, reject) {
        studentIds = lodash.shuffle(studentIds);
        teacherIds = lodash.shuffle(teacherIds);

        // increase length of teacher array
        while (teacherIds.length < studentIds.length) {
            teacherIds = teacherIds.concat(teacherIds);
        }

        const studentTeachers = [];
        for (let i = 0; i < studentIds.length; i++) {
            studentTeachers.push({
                studentId: studentIds[i],
                teacherId: teacherIds[i],
            });
        }

        resolve(studentTeachers);
    });
}

export { randomize };
