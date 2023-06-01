import { models, sequelize, Op } from "../database/db.js";
import { Response } from "../utilities/response-format-utilities.js";

/**
 * Do request by spl2 team
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function teamRequest(req, res, next) {
    try {
        const { teamId, teacherId } = req.params;

        // check if already requested that teacher or not
        const requested = await models.TeamRequest.findOne({
            where: {
                teamId,
                teacherId,
            },
            raw: true,
        });

        if (requested) {
            res.status(400).json(Response.error("Already requested this teacher"));
            return;
        }

        // do request to the teacher
        await models.TeamRequest.create({
            teamId,
            teacherId,
        });

        // trigger a notification after the request??

        res.json(Response.success("Request sent successfully"));
    } catch (err) {
        console.log(err);
        res.status(400).json(Response.error("Internal Server Error"));
    }
}

/**
 * Accept spl2 team
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export async function acceptTeamRequest(req, res, next) {
    try {
        const { teamId } = req.params;
        const { userId } = req.user;
        const { splId } = req.spl;
        const { teamMembers } = req;

        // assign supervisor and delete all the requests of that team
        const transaction = await sequelize.transaction();
        try {
            const studentSupervisors = [];
            for (const studentId of teamMembers) {
                studentSupervisors.push({
                    studentId,
                    teacherId: userId,
                    splId,
                });
            }

            // add supervisor
            await models.StudentSupervisor.bulkCreate(studentSupervisors, {
                transaction: transaction,
            });

            // delete all requests of that student
            await models.TeamRequest.destroy({
                where: {
                    teamId: teamId,
                },
                transaction: transaction,
            });

            await transaction.commit();

            res.json(Response.success("Request accepted"));
        } catch (err) {
            await transaction.rollback();
            console.log(err);
            res.status(500).json(Response.error("Internal server error"));
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal server error"));
    }
}

/**
 * Do request by spl3 student
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function studentRequest(req, res, next) {
    try {
        const { teacherId } = req.params;
        const studentId = req.user.userId;

        // check teacher existence
        const teacher = await models.User.findOne({
            include: {
                model: models.Teacher,
                attributes: ["available"],
                required: false,
            },
            where: {
                userId: teacherId,
                active: true,
                userType: "teacher",
            },
            raw: true,
            nest: true,
            attributes: ["userId"],
        });

        if (!teacher) {
            res.status(400).json(Response.error("Teacher does not exist"));
            return;
        }

        if (!teacher.Teacher.available) {
            res.status(400).json(Response.error("Teacher is not available"));
            return;
        }

        // check if already requested this teacher or not
        const requested = await models.StudentTeacher_Request.findOne({
            where: {
                studentId,
                teacherId,
            },
            raw: true,
        });

        if (requested) {
            res.status(400).json(Response.error("Already requested this teacher"));
            return;
        }

        // do request to the teacher
        await models.StudentTeacher_Request.create({
            studentId,
            teacherId,
        });

        // trigger a notification after the request

        res.json(Response.success("Request sent successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
    }
}

/**
 * Accept spl3 student
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function acceptStudentRequest(req, res, next) {
    try {
        const { studentId } = req.params;
        const teacherId = req.user.userId;

        // find the student's active spl3
        const spl = await models.SPL.findOne({
            include: {
                model: models.Student,
                through: {
                    model: models.StudentSPL,
                    attributes: [],
                },
                where: {
                    studentId,
                },
                attributes: [],
            },
            where: {
                active: true,
                splName: "spl3",
            },
            attributes: ["splId"],
            raw: true,
            nest: true,
        });

        if (!spl) {
            res.status(400).json(Response.error("Student is not assigned to SPL3"));
            return;
        }

        // check if the student already has supervisor or not
        const supervisor = await models.StudentSupervisor.findOne({
            where: {
                splId: spl.splId,
                studentId,
            },
        });

        if (supervisor) {
            res.status(500).json(Response.error("Already has supervisor"));
            return;
        }

        // assign supervisor and delete all the requests of that student
        const transaction = await sequelize.transaction();
        try {
            // add supervisor
            await models.StudentSupervisor.create(
                {
                    studentId,
                    teacherId,
                    splId: spl.splId,
                },
                {
                    transaction: transaction,
                }
            );

            // delete all requests of that student
            await models.StudentRequest.destroy({
                where: {
                    studentId,
                },
                transaction: transaction,
            });

            await transaction.commit();

            res.json(Response.success("Request accepted"));
        } catch (err) {
            await transaction.rollback();
            console.log(err);
            res.status(500).json(Response.error("Internal server error"));
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal server error"));
    }
}

export async function rejectStudentRequest(req, res, next) {
    try {
        const { userId } = req.user;
        const { studentId } = req.params;

        await models.StudentRequest.destroy({
            where: {
                studentId,
                teacherId: userId,
            },
        });

        res.json(Response.success("Rejected student request"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal server error"));
    }
}

export async function rejectTeamRequest(req, res, next) {
    try {
        const { userId } = req.user;
        const { teamId } = req.params;

        await models.TeamRequest.destroy({
            where: {
                teamId,
                teacherId: userId,
            },
        });

        res.json(Response.success("Rejected team request"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal server error"));
    }
}

export async function cancelTeamRequestByStudent(req, res, next) {
    try {
        const { teamId, teacherId } = req.params;

        await models.TeamRequest.destroy({
            where: {
                teacherId: teacherId,
                teamId: teamId,
            },
        });

        res.json(Response.success("Cancelled team request"));
    } catch (error) {
        console.log(error);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

export async function cancelStudentRequestByStudent(req, res, next) {
    try {
        const { teacherId } = req.params;
        const { userId } = req.user;

        await models.StudentRequest.destroy({
            where: {
                teacherId: teacherId,
                studentId: userId,
            },
        });

        res.json(Response.success("Cancelled team request"));
    } catch (error) {
        console.log(error);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}
