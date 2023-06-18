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


/**
 * Check if all elements of an array is unique or not
 * @param {Array} array
 * @returns {boolean} true/false
 */
function isUnique(array) {
    return new Set(array).size === array.length;
}

/**
 *
 * @param {Array} array
 * @returns duplicate elements
 */
function findDuplicates(array) {
    const duplicates = lodash.filter(array, (value, index, iteratee) =>
        lodash.includes(iteratee, value, index + 1)
    );
    return lodash.uniq(duplicates);
}

/**
 * Make the array unique by changing the original instance
 * @param {Array} array
 */
function makeUnique(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr.indexOf(arr[i]) !== i) {
            arr.splice(i, 1);
            i--;
        }
    }
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

export {
    isUnique,
    findDuplicates,
    makeUnique,
    filterArray,
    clearArray,
    concatArray,
    getCurrentDate,
};

/**
 * [spl1 <-> 2nd],
 * [spl2 <-> 3rd],
 * [spl3 <-> 4th],
 * @param {String} splName
 * @returns {String} curriculumYear corresponding to splName
 */
function getCurriculumYear(splName) {
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
function getSPLName(curriculumYear) {
    const splName = curriculumYear === "2nd" ? "spl1" : curriculumYear === "3rd" ? "spl2" : "spl3";
    return splName;
}

export { getSPLName, getCurriculumYear };
