/**
 * [spl1 <-> 2nd],
 * [spl2 <-> 3rd],
 * [spl3 <-> 4th],
 * @param {String} splName
 * @returns {String} curriculumYear corresponding to splName
 */
export function getCurriculumYear(splName) {
    const curriculumYear = splName === "spl1" ? "2nd" : splName === "spl2" ? "3rd" : "4th";
    return curriculumYear;
}

/**
 * [spl1 <-> 2nd],
 * [spl2 <-> 3rd],
 * [spl3 <-> 4th],
 * @param {*} curriculumYear
 * @returns {String} splName corresponding to curriculum year
 */
export function getSPLName(curriculumYear) {
    const splName = curriculumYear === "2nd" ? "spl1" : curriculumYear === "3rd" ? "spl2" : "spl3";
    return splName;
}

/**
 * Randomize supervisor for students [MOVE IT TO SERVICES]
 * @param {Array} studentIds
 * @param {Array} teacherIds
 * @return {Promise<Array>} [{studentId, TeacherId}]
 */
export function randomize(studentIds, teacherIds) {
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

export default { getSPLName, getCurriculumYear, randomize };
