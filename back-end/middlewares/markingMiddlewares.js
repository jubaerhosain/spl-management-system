import { Response } from "../utilities/response-format-utilities.js";
import { models } from "../database/db.js";


async function checkAddPresentationMark(req, res, next) {
    try {
        const { presentationId, studentId } = req.params;

        // check the presentation
        const presentation = await models.Presentation.findOne({
            include: {
                model: models.SPL,
                attributes: ["splId", "splName", "academicYear"],
            },
            where: {
                presentationId,
            },
            raw: true,
            nest: true,
            attributes: ["presentationId"],
        });

        if (!presentation) {
            res.status(400).json(Response.error("Invalid presentation"));
            return;
        }

        // put spl to the req
        req.spl = presentation.SPL;

        // check student is valid or not and belongs to the presentation spl or not
        const student = await models.Student.findOne({
            include: {
                model: models.SPL,
                through: {
                    model: models.StudentSPL,
                    attributes: [],
                },
                where: {
                    splId: req.spl.splId,
                    active: true,
                },
                attributes: ["splId"],
                required: false,
            },
            where: {
                studentId,
            },
            raw: true,
            nest: true,
            attributes: ["studentId"],
        });

        if (!student) {
            res.status(400).json(Response.error("Student does not exists"));
            return;
        }

        if (!student.SPLs.splId) {
            res.status(400).json(
                Response.error(`Student is not belongs to ${req.spl.splName.toUpperCase()}`)
            );
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function checkUpdatePresentationMark(req, res, next) {
    try {
        const { presentationMarkId } = req.params;
        const presentationMark = await models.PresentationMark.findOne({
            where: {
                presentationMarkId,
            },
            raw: true,
            attributes: ["presentationMarkId", "mark"],
        });

        if (!presentationMark) {
            res.status(400).json(Response.error("Presentation mark not found"));
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function checkAddSupervisorMark(req, res, next) {
    try {
        const { userId } = req.user;
        const { studentId } = req.params;

        // check if the student is belongs to any active spl
        const student = await models.Student.findOne({
            include: {
                model: models.SPL,
                through: {
                    model: models.StudentSPL,
                    attributes: [],
                },
                where: {
                    active: true,
                },
                attributes: ["splId", "splName", "academicYear"],
                required: false,
            },
            where: {
                studentId: studentId,
            },
            raw: true,
            nest: true,
            attributes: ["studentId"],
        });

        if (!student) {
            res.status(400).json(Response.error("Student does not exist"));
            return;
        }

        if (!student.SPLs.splId) {
            res.status(400).json(Response.error("Student is not belongs to any active SPL"));
            return;
        }

        // put spl info to the req
        req.spl = student.SPLs;

        // check if the teacher is the supervisor of that student
        const supervisor = await models.StudentSupervisor.findOne({
            where: {
                studentId,
                teacherId: userId,
                splId: req.spl.splId,
            },
            raw: true,
        });

        if (!supervisor) {
            res.status(400).json(Response.error("You are not supervisor of that student"));
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function checkAddCodingMark(req, res, next) {
    try {
        const { studentId } = req.params;

        // check if the student is belongs to any active spl
        const student = await models.Student.findOne({
            include: {
                model: models.SPL,
                through: {
                    model: models.StudentSPL,
                    attributes: [],
                },
                where: {
                    active: true,
                },
                attributes: ["splId", "splName", "academicYear"],
                required: false,
            },
            where: {
                studentId: studentId,
            },
            raw: true,
            nest: true,
            attributes: ["studentId"],
        });

        if (!student) {
            res.status(400).json(Response.error("Student does not exist"));
            return;
        }

        if (!student.SPLs.splId) {
            res.status(400).json(Response.error("Student is not belongs to any active SPL"));
            return;
        }

        // put spl info to the req
        req.spl = student.SPLs;

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function checkUpdateCodingAndSupervisorMark(req, res, next) {
    try {
        const { markId } = req.params;

        const mark = await models.Mark.findOne({
            where: {
                markId,
            },
            attributes: ["markId"],
            raw: true,
        });

        if (!mark) {
            res.status(400).json(Response.error("Mark not found"));
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function checkAddContinuousMark(req, res, next) {
    try {
        const { studentId } = req.params;

        // check if the student is belongs to any active spl
        const student = await models.Student.findOne({
            include: {
                model: models.SPL,
                through: {
                    model: models.StudentSPL,
                    attributes: [],
                },
                where: {
                    active: true,
                },
                attributes: ["splId", "splName", "academicYear"],
                required: false,
            },
            where: {
                studentId: studentId,
            },
            raw: true,
            nest: true,
            attributes: ["studentId"],
        });

        if (!student) {
            res.status(400).json(Response.error("Student does not exist"));
            return;
        }

        if (!student.SPLs.splId) {
            res.status(400).json(Response.error("Student is not belongs to any active SPL"));
            return;
        }

        // put spl info to the req
        req.spl = student.SPLs;

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

async function checkUpdateContinuousMark(req, res, next) {
    try {
        const { continuousMarkId } = req.params;

        const continuousMark = await models.ContinuousMark.findOne({
            where: {
                continuousMarkId,
            },
            raw: true,
            attributes: ["mark"],
        });

        if (!continuousMark) {
            res.status(400).json(Response.error("Continuous mark does not exists"));
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

export {
    checkAddPresentationMark,
    checkUpdatePresentationMark,
    checkAddSupervisorMark,
    checkAddCodingMark,
    checkUpdateCodingAndSupervisorMark,
    checkAddContinuousMark,
    checkUpdateContinuousMark,
};
