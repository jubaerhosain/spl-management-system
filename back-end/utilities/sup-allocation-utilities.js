import lodash from "lodash";

/**
 *
 * @param {Array} studentIds
 * @param {Array} teacherIds
 * @param {Integer} splId
 * @return {Promise<Array>} [{studentId, TeacherId, splId}]
 */
function randomize(studentIds, teacherIds, splId) {
    return new Promise(function (resolve, reject) {
        studentIds = lodash.shuffle(studentIds);
        teacherIds = lodash.shuffle(teacherIds);

        // increase length of teacher array
        while (teacherIds.length < studentIds.length) {
            teacherIds = teacherIds.concat(teacherIds);
        }

        const studentSupervisors = [];
        for (let i = 0; i < studentIds.length; i++) {
            studentSupervisors.push({
                studentId: studentIds[i],
                teacherId: teacherIds[i],
                splId,
            });
        }

        resolve(studentSupervisors);
    });
}

export { randomize };
