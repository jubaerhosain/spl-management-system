import createError from "http-errors";
import { getCurriculumYear } from "../../utilities/spl-utilities.js";
import { filterArray } from "../../utilities/common-utilities.js";
import { body_param, body, param, validationResult } from "../custom-validator.js";
import { models, Op } from "../../database/db.js";

// import db checkers
import { teacherIdExistence } from "./teacher-db-checkers.js";


/**
 * Put spl to the req if active splName exists, otherwise throw an error
 */
const splNameExistence = body_param("splName")
    .if((value, { req }) => validationResult(req).isEmpty())
    .custom(async (splName, { req }) => {
        try {
            const spl = await models.SPL.findOne({
                where: {
                    active: true,
                    splName,
                },
                attributes: ["splId", "splName", "splManager", "academicYear"],
                raw: true,
            });

            if (!spl) {
                const message = `There is no active ${splName.toUpperCase()}`;
                throw new createError(400, message);
            }

            req.spl = spl;
        } catch (err) {
            console.log(err);
            const message = err.status ? err.message : "Internal server error";
            throw new Error(message);
        }
    });

/**
 * Put spl to the req if spl is active, otherwise throw an error
 */
const splIdExistence = body_param("splId")
    .if((value, { req }) => validationResult(req).isEmpty())
    .custom(async (splId, { req }) => {
        try {
            const spl = await models.SPL.findOne({
                where: {
                    splId,
                    active: true,
                },
                attributes: ["splId", "splName", "academicYear", "splManager"],
                raw: true,
            });

            if (!spl) {
                const message = `SPL doesn't exists`;
                throw new createError(400, message);
            }

            req.spl = spl;
        } catch (err) {
            console.log(err);
            const message = err.status ? err.message : "Internal server error";
            throw new Error(message);
        }
    });

const createSPLDbCheck = [
    body_param("splName").custom(async (splName, { req }) => {
        try {
            const spl = await models.SPL.findOne({
                where: {
                    active: true,
                    splName,
                },
                attributes: ["splId"],
                raw: true,
            });

            if (spl) {
                const message = `${splName.toUpperCase()} already active`;
                throw new createError(400, message);
            }
        } catch (err) {
            console.log(err);
            const message = err.status ? err.message : "Internal server error";
            throw new Error(message);
        }
    }),
];

const addSPLManagerDbCheck = [
    body_param("splId").custom(async (splId, { req }) => {
        try {
            const spl = await models.SPL.findOne({
                where: {
                    splId,
                },
                attributes: ["splId", "splManager"],
                raw: true,
            });

            if (!spl) {
                const message = `SPL doesn't exists`;
                throw new createError(400, message);
            }

            if (spl.splManager) {
                const message = `Already have SPL Manager`;
                throw new createError(400, message);
            }
        } catch (err) {
            console.log(err);
            const message = err.status ? err.message : "Internal server error";
            throw new Error(message);
        }
    }),
    teacherIdExistence,
];

const removeSPLManagerDbCheck = [
    body_param("splId").custom(async (splId, { req }) => {
        try {
            const spl = await models.SPL.findOne({
                where: {
                    splId,
                },
                attributes: ["splId", "splManager"],
                raw: true,
            });

            if (!spl) {
                const message = `SPL doesn't exists`;
                throw new createError(400, message);
            }

            if (!spl.splManager) {
                const message = `There is no SPL Manager`;
                throw new createError(400, message);
            }
        } catch (err) {
            console.log(err);
            const message = err.status ? err.message : "Internal server error";
            throw new Error(message);
        }
    }),
];

const assignStudentDbCheck = [
    splIdExistence,

    // check if all students are from 'curriculumYear' or not
    body("students")
        .if((value, { req }) => validationResult(req).isEmpty())
        .custom(async (students, { req }) => {
            try {
                const { splName } = req.spl;
                const curriculumYear = getCurriculumYear(splName);
                const curriculumYearStudents = await models.Student.findAll({
                    where: {
                        studentId: {
                            [Op.in]: students,
                        },
                        curriculumYear,
                    },
                    attributes: ["studentId"],
                    raw: true,
                });

                if (curriculumYearStudents.length !== students.length) {
                    const message = `All must be ${curriculumYear} year students`;
                    throw new createError(400, message);
                }
            } catch (err) {
                if (!err.status) console.log(err);
                const message = err.status ? err.message : "Internal server error.";
                throw new Error(message);
            }
        }),

    // check if any student is already assigned to any active spl
    body("students")
        .if((value, { req }) => validationResult(req).isEmpty())
        .custom(async (students, { req }) => {
            try {
                const { splId, splName } = req.spl;
                let curriculumYearStudents = await models.StudentSPL.findAll({
                    where: {
                        studentId: {
                            [Op.in]: students,
                        },
                        splId,
                    },
                    attributes: ["studentId"],
                    raw: true,
                });

                curriculumYearStudents = curriculumYearStudents.map((student) => student.studentId);

                // remove already assigned students from students array
                students = filterArray(students, curriculumYearStudents);

                if (students.length == 0) {
                    const message = `Students are already assigned to ${splName.toUpperCase()}`;
                    throw new createError(400, message);
                }

                // put new students to req [making changes in original students instance]
                req.body.students.splice(0);
                for (const student of students) req.body.students.push(student);
            } catch (err) {
                if (!err.status) console.log(err);
                const message = err.status ? err.message : "Internal server error.";
                throw new Error(message);
            }
        }),
];

/**
 * Check the spl is valid or not and the student is assigned to this spl or not
 */
const removeStudentDbCheck = [
    body_param("splId").custom(async (splId, { req }) => {
        try {
            const { studentId } = req.params;
            const spl = await models.SPL.findOne({
                include: {
                    model: models.Student,
                    through: {
                        model: models.StudentSPL,
                        attributes: [],
                        where: {
                            studentId: studentId,
                        },
                    },
                    attributes: ["studentId"],
                    required: false, // Perform a left join
                },
                where: {
                    splId,
                },
                attributes: ["splId"],
                raw: true,
                nest: true,
            });

            if (!spl) {
                const message = `SPL doesn't exists`;
                throw new createError(400, message);
            }

            if (!spl.Students.studentId) {
                const message = `Student doesn't belongs to this SPL`;
                throw new createError(400, message);
            }
        } catch (err) {
            console.log(err);
            const message = err.status ? err.message : "Internal server error";
            throw new Error(message);
        }
    }),
];

export {
    splNameExistence,
    splIdExistence,
    createSPLDbCheck,
    addSPLManagerDbCheck,
    removeSPLManagerDbCheck,
    assignStudentDbCheck,
    removeStudentDbCheck,
};
