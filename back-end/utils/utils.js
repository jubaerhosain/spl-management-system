import lodash from "lodash";

// /**
//  * Randomize supervisor for students [MOVE IT TO SERVICES]
//  * @param {Array} studentIds
//  * @param {Array} teacherIds
//  * @return {Promise<Array>} [{studentId, TeacherId}]
//  */
// function randomize(studentIds, teacherIds) {
//     return new Promise(function (resolve, reject) {
//         studentIds = lodash.shuffle(studentIds);
//         teacherIds = lodash.shuffle(teacherIds);

//         // increase length of teacher array
//         while (teacherIds.length < studentIds.length) {
//             teacherIds = teacherIds.concat(teacherIds);
//         }

//         const studentTeachers = [];
//         for (let i = 0; i < studentIds.length; i++) {
//             studentTeachers.push({
//                 studentId: studentIds[i],
//                 teacherId: teacherIds[i],
//             });
//         }

//         resolve(studentTeachers);
//     });
// }

function countOccurrences(array, target) {
    return lodash.countBy(array)[target] || 0;
}

/**
 * Check if all elements of an array is unique or not
 * @param {Array} array
 * @returns {boolean} true/false
 */
function isUnique(array) {
    return new Set(array).size === array.length;
}

/**
 * Current date in 'YYYY-MM-DD' format
 */
function getCurrentDate() {
    return new Date().toISOString().slice(0, 10);
}

function isObjectEmpty(object) {
    return !object || Object.keys(object).length == 0;
}

export default {
    isUnique,
    getCurrentDate,
    countOccurrences,
    isObjectEmpty,
};
