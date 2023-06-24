import lodash from "lodash";

/**
 * Randomize supervisor for students [MOVE IT TO SERVICES]
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


/**
 * Check if all elements of an array is unique or not
 * @param {Array} array
 * @returns {boolean} true/false
 */
function isUnique(array) {
    return new Set(array).size === array.length;
}


function makeUnique(arr) {
    return lodash.uniq(arr);
}

/**
 * Remove elements of array2 from the array1
 * @param {Array} array1
 * @param {Array} array2
 * @returns {Array} new array
 */
function filterArray(array1, array2) {
    const newArray = array1.filter((element) => !array2.includes(element));
    return newArray;
}

/**
 * Clear the array making changes in original instance
 * @param {*} array
 */
function clearArray(array) {
    array.splice(0);
}

/**
 * Push elements of array2 into the array1 making changes in original instance
 * @param {*} array1
 * @param {*} array2
 */
function concatArray(array1, array2) {
    for (const item of array2) array1.push(item);
}

/**
 * Current date in 'YYYY-MM-DD' format
 */
function getCurrentDate() {
    return new Date().toISOString().slice(0, 10);
}

export default {
    isUnique,
    makeUnique,
    filterArray,
    clearArray,
    concatArray,
    getCurrentDate,
};