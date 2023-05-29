import createError from "http-errors";
import { models, Op, sequelize } from "../database/db.js";
import { filterArray } from "../utilities/common-utilities.js";
import { Response } from "../utilities/response-format-utilities.js";
import { getCurriculumYear } from "../utilities/spl-utilities.js";

/**
 * Create a spl for new academic year
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function createSPL(req, res, next) {
    try {
        const { splName, academicYear } = req.body;
        await models.SPL.create({
            academicYear,
            splName,
        });

        res.json({
            message: `${splName.toUpperCase()}, ${academicYear} is created successfully`,
        });
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error.";
        next(new createError(err.status || 500, message));
    }
}

/**
 * Add spl manager for a particular spl
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function addSPLManager(req, res, next) {
    try {
        const { splId, teacherId } = req.params;

        await models.SPL.update(
            {
                splManager: teacherId,
            },
            {
                where: {
                    splId,
                },
            }
        );

        res.json({
            message: `SPL Manager added successfully`,
        });
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error.";
        next(new createError(err.status || 500, message));
    }
}

/**
 * Remove spl manager from a particular spl
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function removeSPLManager(req, res, next) {
    try {
        const { splId } = req.params;

        // update to null instead of deleting the spl
        await models.SPL.update(
            {
                splManager: null,
            },
            {
                where: {
                    splId,
                },
            }
        );

        res.json({
            message: `SPL Manager removed successfully`,
        });
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error";
        next(new createError(err.status || 500, message));
    }
}

/**
 * Assign students to the corresponding spl
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function assignStudent(req, res, next) {
    try {
        const { studentIds } = req.body;
        const { splId, splName } = req.spl;

        // check already assigned or not
        let assignedStudents = await models.StudentSPL.findAll({
            where: {
                splId,
                studentId: {
                    [Op.in]: studentIds,
                },
            },
            raw: true,
        });
        assignedStudents = assignedStudents.map((student) => student.studentId);

        const unassignedStudents = filterArray(studentIds, assignedStudents);

        if (unassignedStudents.length == 0) {
            const message = `All ${getCurriculumYear(
                splName
            )} Year student are already assigned to ${splName.toUpperCase()}`;
            res.status(400).json(Response.error(message));
            return;
        }

        const studentSPL = [];
        for (const studentId of unassignedStudents) {
            studentSPL.push({
                studentId,
                splId,
            });
        }

        const transaction = await sequelize.transaction();
        try {
            // assign to spl
            await models.StudentSPL.bulkCreate(studentSPL, {
                transaction: transaction,
            });

            // create mark row in mark table
            await models.Mark.bulkCreate(studentSPL, {
                transaction: transaction,
            });

            await transaction.commit();

            res.status(200).json({
                message: `${getCurriculumYear(
                    splName
                )} year students are successfully assigned to ${splName.toUpperCase()}`,
            });
        } catch (error) {
            await transaction.rollback();
            console.error("Transaction rolled back:", error);
        }
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error";
        next(new createError(err.status || 500, message));
    }
}

/**
 * Remove a student from a spl
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function removeStudent(req, res, next) {
    try {
        const { splId, studentId } = req.params;

        await models.StudentSPL.destroy({
            where: {
                splId,
                studentId,
            },
        });

        res.json({
            message: `Student removed successfully`,
        });
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error";
        next(new createError(err.status || 500, message));
    }
}

// finalize a spl after its completion [by a particular spls' committee head]
async function finalizeSPL(req, res, next) {
    try {
        res.end(req.params.splName);
        // deactivate committee
        // upgrade student to next curriculum year
        // delete all temporary database related to this spl/spl students/spl teachers
    } catch (err) {
        console.log(err);
        next(new createError(err.status || 500, "An error occurred finalize the spls"));
    }
}

export { createSPL, addSPLManager, removeSPLManager, assignStudent, removeStudent, finalizeSPL };
