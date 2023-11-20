import createError from "http-errors";
import { models, Op } from "../database/db.js";
import { getCurrentDate } from "../utilities/common-utilities.js";
import { GenericResponse } from "../utilities/response-format-utilities.js";

/**
 * Create a mark raw in "Marks" table
 */
async function createMark({ studentId, splId }) {
    try {
        const studentMark = await models.Mark.create({
            studentId,
            splId,
        });
        return studentMark;
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("Internal Server Error"));
    }
}

async function addPresentationMark(req, res, next) {
    try {
        const teacherId = req.user.userId;

        const { mark } = req.body;
        const { splId } = req.spl;
        const { presentationId, studentId } = req.params;

        // find mark of that student at current spl
        let studentMark = await models.Mark.findOne({
            where: {
                studentId: studentId,
                splId: splId,
            },
            attributes: ["markId"],
            raw: true,
        });

        // create a mark row in "Marks" table if not exist
        if (!studentMark) {
            studentMark = await createMark({ studentId, splId });
        }

        // check if mark already given for that presentation
        const presentationMark = await models.PresentationMark.findOne({
            where: {
                presentationId: presentationId,
                markId: studentMark.markId,
            },
            raw: true,
        });

        if (presentationMark) {
            res.status(400).json(
                GenericResponse.error("Presentation mark is already given to that student")
            );
            return;
        }

        // add presentation mark
        await models.PresentationMark.create({
            markId: studentMark.markId,
            presentationId: presentationId,
            teacherId: teacherId,
            mark: mark,
        });

        res.json(GenericResponse.success("Presentation mark added successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("Internal Server Error"));
    }
}

async function updatePresentationMark(req, res, next) {
    try {
        const { mark } = req.body;
        const { presentationMarkId } = req.params;

        await models.PresentationMark.update(
            {
                mark: mark,
            },
            {
                where: {
                    presentationMarkId: presentationMarkId,
                },
            }
        );

        res.json(GenericResponse.success("Presentation mark updated successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("Internal Server Error"));
    }
}

async function addSupervisorMark(req, res, next) {
    try {
        const { splId } = req.spl;
        const { mark } = req.body;
        const { studentId } = req.params;

        // find mark of that student at current spl
        let studentMark = await models.Mark.findOne({
            where: {
                studentId: studentId,
                splId: splId,
            },
            attributes: ["markId", "supervisorMark"],
            raw: true,
        });

        // create a mark row in "Marks" table if not exist
        if (!studentMark) {
            studentMark = await createMark({ studentId, splId });
        }

        if (studentMark.supervisorMark > 0) {
            res.status(400).json(GenericResponse.error("Supervisor mark is already given"));
            return;
        }

        // add supervisor mark
        await models.Mark.update(
            {
                supervisorMark: mark,
            },
            {
                where: {
                    markId: studentMark.markId,
                },
            }
        );

        res.json(GenericResponse.success("Supervisor mark added successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("Internal Server Error"));
    }
}

async function updateSupervisorMark(req, res, next) {
    try {
        const { mark } = req.body;
        const { markId } = req.params;

        await models.Mark.update(
            {
                supervisorMark: mark,
            },
            {
                where: {
                    markId: markId,
                },
            }
        );

        res.json({
            message: "Supervisor mark is updated successfully.",
        });
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error.";
        next(new createError(err.status || 500, message));
    }
}

async function addCodingMark(req, res, next) {
    try {
        const { splId } = req.spl;
        const { mark } = req.body;
        const { studentId } = req.params;

        // find mark of that student at current spl
        let studentMark = await models.Mark.findOne({
            where: {
                studentId: studentId,
                splId: splId,
            },
            attributes: ["markId", "codingMark"],
            raw: true,
        });

        // create a mark row in "Marks" table if not exist
        if (!studentMark) {
            studentMark = await createMark({ studentId, splId });
        }

        if (studentMark.codingMark > 0) {
            res.status(400).json(GenericResponse.error("Coding mark is already given"));
            return;
        }

        // add coding mark
        await models.Mark.update(
            {
                codingMark: mark,
            },
            {
                where: {
                    markId: studentMark.markId,
                },
            }
        );

        res.json(GenericResponse.success("Coding mark added successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("Internal Server Error"));
    }
}

async function updateCodingMark(req, res, next) {
    try {
        const { mark } = req.body;
        const { markId } = req.params;

        await models.Mark.update(
            {
                codingMark: mark,
            },
            {
                where: {
                    markId: markId,
                },
            }
        );

        res.json(GenericResponse.success("Coding mark updated successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("Internal Server Error"));
    }
}

async function addContinuousMark(req, res, next) {
    try {
        const { splId } = req.spl;
        const { mark } = req.body;
        const { studentId } = req.params;

        // find mark of that student at current spl
        let studentMark = await models.Mark.findOne({
            where: {
                studentId: studentId,
                splId: splId,
            },
            attributes: ["markId"],
            raw: true,
        });

        // create a mark row in "Marks" table if not exist
        if (!studentMark) {
            studentMark = await createMark({ studentId, splId });
        }

        // check if mark already given today or not
        const continuousMark = await models.ContinuousMark.findOne({
            where: {
                date: getCurrentDate(),
                markId: studentMark.markId,
            },
            raw: true,
        });

        if (continuousMark) {
            res.status(400).json(
                GenericResponse.error("Today's continuous mark is already given to that student")
            );
            return;
        }

        // add continuous mark
        await models.ContinuousMark.create({
            markId: studentMark.markId,
            mark: mark,
        });

        res.json(GenericResponse.success("Continuous Mark added successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("Internal Server Error"));
    }
}

async function updateContinuousMark(req, res, next) {
    try {
        const { mark } = req.body;
        const { continuousMarkId } = req.params;

        await models.ContinuousMark.update(
            {
                mark: mark,
            },
            {
                where: {
                    continuousMarkId: continuousMarkId,
                },
            }
        );

        res.json(GenericResponse.success("Continuous mark updated successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("Internal Server Error"));
    }
}

async function getMarksByStudentId(req, res, next) {
    try {
        const { studentId } = req.params;

        // add splId ?
        const mark = await models.Mark.findAll({
            where: {
                studentId,
            },
            raw: true,
            nest: true,
        });

        if (!mark) {
            res.status(500).json(GenericResponse.error("NO marks found"));
        }

        const presentationMarks = await models.PresentationMark.findAll({
            where: {
                markId: mark.markId,
            },
            raw: true,
        });

        const continuousMarks = await models.ContinuousMark.findAll({
            where: {
                markId: mark.markId,
            },
            raw: true,
        });

        mark.presentationMarks = presentationMarks;
        mark.continuousMarks = continuousMarks;

        console.log(mark);
        res.json(GenericResponse.success("Marks retrieved successfully", mark));
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error(""));
    }
}

async function getMarksByCurriculumYear(req, res, next) {
    try {
        const { curriculumYear } = req.params;
        let studentIds = await models.Student.findAll({
            where: {
                curriculumYear,
            },
            raw: true,
        });
        studentIds = studentIds.map((student) => student.studentId);

        console.log(studentIds);

        // add splId ?
        const marks = await models.Mark.findAll({
            include: [
                {
                    model: models.PresentationMark,
                    required: false,
                },
                {
                    model: models.ContinuousMark,
                    required: false,
                },
            ],
            where: {
                studentId: {
                    [Op.in]: studentIds,
                },
            },
            raw: true,
            nest: true,
        });

        console.log(marks);
        res.json(GenericResponse.success("Marks retrieved successfully", marks));
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error(""));
    }
}

export {
    addPresentationMark,
    updatePresentationMark,
    addSupervisorMark,
    updateSupervisorMark,
    addCodingMark,
    updateCodingMark,
    addContinuousMark,
    updateContinuousMark,
    getMarksByStudentId,
    getMarksByCurriculumYear,
};
