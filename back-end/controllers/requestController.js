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
        const { teamId, teacherId } = req.query;

        // check if already requested that teacher or not
        const requested = await models.TeamTeacher_Request.findOne({
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
        await models.TeamTeacher_Request.create({
            teamId,
            teacherId,
        });

        // trigger a notification after the request

        res.json(Response.success("Request sent successfully"));
    } catch (err) {
        console.log(err);
        res.status(400).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
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
        const { teamId } = req.query;
        const { userId } = req.user;
        const { splId } = req.body.spl;
        const { teamMemberIds } = req.body;

        // console.log(teamMemberIds, req.body.spl)

        // assign supervisor and delete all the requests of that team
        const transaction = await sequelize.transaction();
        try {
            const studentTeachers = [];
            for (const studentId of teamMemberIds) {
                studentTeachers.push({
                    studentId,
                    teacherId: userId,
                    splId,
                });
            }

            // add supervisor
            await models.StudentTeacher_Supervisor.bulkCreate(studentTeachers, {
                transaction: transaction,
            });

            // delete all requests of that student
            await models.TeamTeacher_Request.destroy({
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
            throw new Error(err.message);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
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
        const { teacherId } = req.query;
        const studentId = req.user.userId;

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
        const { studentId } = req.query;
        const teacherId = req.user.userId;

        const { splId } = req.body.spl;

        // assign supervisor and delete all the requests of that student
        const transaction = await sequelize.transaction();
        try {
            // add supervisor
            await models.StudentTeacher_Supervisor.create(
                {
                    studentId,
                    teacherId,
                    splId: splId,
                },
                {
                    transaction: transaction,
                }
            );

            // delete all requests of that student
            await models.StudentTeacher_Request.destroy({
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
            throw new Error(err.message);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
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
