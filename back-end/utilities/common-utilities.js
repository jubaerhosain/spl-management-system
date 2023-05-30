/**
 * Check if all elements of an array is unique or not
 * @param {Array} array
 * @returns {boolean} true/false
 */
function isUnique(array) {
    return new Set(array).size === array.length;
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

export { isUnique, makeUnique, filterArray, clearArray, concatArray, getCurrentDate };
