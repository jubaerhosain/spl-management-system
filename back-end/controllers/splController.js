import createError from "http-errors";
import { models, Op, sequelize } from "../database/db.js";
import { filterArray } from "../utilities/common-utilities.js";
import { Response } from "../utilities/response-format-utilities.js";
import { getCurriculumYear } from "../utilities/spl-utilities.js";

async function createSPL(req, res, next) {
    try {
        const { splName, academicYear } = req.body;
        await models.SPL.create({
            academicYear,
            splName,
        });

        res.json(
            Response.success(`${splName.toUpperCase()}, ${academicYear} is created successfully`)
        );
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
    }
}

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
async function assignStudentToSPL(req, res, next) {
    try {
        const { splId, splName } = req.body.spl;
        const curriculumYear = getCurriculumYear(splName);

        // find all active students of ${curriculumYear} left join with ${splName}
        const students = await models.Student.findAll({
            include: [
                {
                    model: models.User,
                    where: {
                        active: true,
                    },
                    attributes: ["active"],
                    required: true,
                },
                {
                    model: models.SPL,
                    through: {
                        model: models.StudentSPL,
                        attributes: [],
                    },
                    where: {
                        splId: splId,
                    },
                    required: false,
                    attributes: ["splId"],
                },
            ],
            where: {
                curriculumYear,
            },
            raw: true,
            nest: true,
            attributes: ["studentId"],
        });

        // console.log(students);

        const unassignedStudents = students.filter((student) => {
            return student.SPLs.splId != splId;
        });

        if (unassignedStudents.length == 0) {
            const message = `There is no student to assign in ${splName.toUpperCase()}`;
            res.status(400).json(Response.error(message));
            return;
        }

        const studentSPL = [];
        const studentIds = unassignedStudents.map((student) => student.studentId);


        for (const studentId of studentIds) {
            studentSPL.push({
                studentId,
                splId,
            });
        }

        const transaction = await sequelize.transaction();
        try {
            // assign to SPL
            await models.StudentSPL.bulkCreate(studentSPL, {
                transaction: transaction,
            });

            // create mark row in Mark table
            await models.Mark.bulkCreate(studentSPL, {
                transaction: transaction,
            });

            await transaction.commit();

            res.json(
                Response.success(
                    `${curriculumYear} year students are successfully assigned to ${splName.toUpperCase()}`
                )
            );
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            throw new Error("Internal Server Error");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
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

export {
    createSPL,
    addSPLManager,
    removeSPLManager,
    assignStudentToSPL,
    removeStudent,
    finalizeSPL,
};
