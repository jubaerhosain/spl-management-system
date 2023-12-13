import lodash from "lodash";

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

function areAllKeysNull(obj) {
    if (isObjectEmpty(obj)) return true;
    const values = Object.values(obj);
    const allNull = values.every((value) => value === null);
    return allNull;
}

export default {
    isUnique,
    getCurrentDate,
    countOccurrences,
    isObjectEmpty,
    areAllKeysNull,
};
