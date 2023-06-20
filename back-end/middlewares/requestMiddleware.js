import { Sequelize, models, Op } from "../database/db.js";
import { Response } from "../utilities/response-format-utilities.js";

/**
 * Checks teacher exist and available or not \
 * Reads teacherId from req.query
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function checkTeacherAvailability(req, res, next) {
    try {
        const { teacherId } = req.query;

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

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
    }
}

/**
 * Authorize 4th year student, if able to request or not
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export async function authorizeStudentRequest(req, res, next) {
    try {
        const { userId } = req.user;

        // must be 4th year student and assigned to active spl3
        const student = await models.Student.findOne({
            include: {
                model: models.SPL,
                through: {
                    model: models.StudentSPL,
                    attributes: [],
                },
                where: {
                    splName: "spl3",
                    active: true,
                },
                required: false,
            },
            where: {
                studentId: userId,
                // curriculumYear: "4th",
            },
            nest: true,
            raw: true,
            attributes: ["studentId", "curriculumYear"],
        });

        if (!student) {
            res.status(400).json(Response.error("Invalid student"));
            return;
        }

        if (student.curriculumYear !== "4th") {
            res.status(400).json(Response.error("Only 4th year students allowed to request"));
            return;
        }

        if (!student.SPLs.splId) {
            res.status(400).json(Response.error("You are not assigned to SPL3"));
            return;
        }

        // put spl to the req body
        req.body.spl = student.SPLs.spl;

        // check if already has supervisor or not
        const supervisor = await models.StudentTeacher_Supervisor.findOne({
            where: {
                studentId: userId,
                splId: student.SPLs.splId,
            },
            attributes: ["teacherId"],
            raw: true,
        });

        if (supervisor) {
            res.status(400).json(Response.error("You already have a supervisor for SPL3"));
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
    }
}

/**
 * Authorize user is a member of that team or not
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function authorizeTeamRequest(req, res, next) {
    try {
        const { teamId, teacherId } = req.query;
        const studentId = req.user.userId;

        const team = await models.Team.findOne({
            include: {
                model: models.Student,
                as: "TeamMembers",
                through: {
                    model: models.StudentTeam,
                    attributes: [],
                },
                attributes: ["studentId"],
            },
            where: {
                teamId,
            },
            // raw: true,
            nest: true,
            attributes: ["teamId", "teamName", "splId"],
        });

        if (!team) {
            res.status(400).json(Response.error("Team does not exist"));
            return;
        }

        // check if student is the member of that team or not
        const teamMemberIds = team.TeamMembers.map((teamMember) => teamMember.studentId);
        if (!teamMemberIds.includes(studentId)) {
            res.status(400).json(Response.error(`Your not a member of ${team.teamName}`));
            return;
        }

        // check if already has supervisor or not
        const supervisor = await models.StudentTeacher_Supervisor.findAll({
            where: {
                studentId: {
                    [Op.in]: teamMemberIds,
                },
                splId: team.splId,
            },
            attributes: ["teacherId"],
            raw: true,
        });

        if (supervisor.length > 0) {
            res.status(400).json(Response.error("You already have a supervisor for SPL2"));
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
    }
}

export async function checkAcceptTeamRequest(req, res, next) {
    try {
        const { userId } = req.user;
        const { teamId } = req.query;

        // check the team is requested or not
        const requested = await models.TeamTeacher_Request.findOne({
            where: {
                teamId,
                teacherId: userId,
            },
            raw: true,
        });

        if (!requested) {
            res.status(400).json(Response.error("Team did not requested you"));
            return;
        }

        // find members and spl
        const team = await models.Team.findOne({
            include: [
                {
                    model: models.Student,
                    as: "TeamMembers",
                    through: {
                        model: models.StudentTeam,
                        attributes: [],
                    },
                    attributes: ["studentId"],
                },
                {
                    model: models.SPL,
                    attributes: ["splId", "splName", "academicYear"],
                },
            ],
            where: {
                teamId,
            },
            nest: true,
            // raw: true,
            attributes: ["teamId"],
        });

        if (!team) {
            res.status(400).json(Response.error("Team does not exist"));
            return;
        }

        // console.log(team);

        const teamMembers = team.TeamMembers.map((member) => member.studentId);

        // console.log(teamMembers);

        // put spl to the req
        req.body.spl = team.SPL.dataValues;

        // put teamMembers to the req
        req.body.teamMemberIds = teamMembers;

        // check supervisor existence
        const supervisor = await models.StudentTeacher_Supervisor.findAll({
            where: {
                studentId: {
                    [Op.in]: teamMembers,
                },
                splId: team.SPL.splId,
            },
            raw: true,
            attributes: ["studentId"],
        });

        if (supervisor.length > 0) {
            res.status(400).json(Response.error("Already have a supervisor"));
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal server error"));
    }
}

export async function checkAcceptStudentRequest(req, res, next) {
    try {
        const { studentId } = req.query;
        const { userId } = req.user;

        // console.log(studentId, userId);

        // check the student is requested or not
        const requested = await models.StudentTeacher_Request.findOne({
            where: {
                studentId,
                teacherId: userId,
            },
            attributes: ["studentId", "teacherId"],
            raw: true,
        });

        // console.log(requested);

        if (!requested) {
            res.status(400).json(Response.error("Student did not requested you"));
            return;
        }

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
                attributes: ["studentId"],
            },
            where: {
                active: true,
                splName: "spl3",
            },
            raw: true,
            nest: true,
        });

        if (!spl) {
            res.status(400).json(Response.error("Student is not assigned to SPL3"));
            return;
        }

        delete spl.Students;

        // console.log(spl);

        // put spl to the req body
        req.body.spl = spl;

        // check if the student already has supervisor or not
        const supervisor = await models.StudentTeacher_Supervisor.findOne({
            where: {
                splId: spl.splId,
                studentId,
            },
        });

        if (supervisor) {
            res.status(500).json(Response.error("Student already has supervisor for SPL3"));
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal server error"));
    }
}