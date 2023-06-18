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
