import { Sequelize, models, Op } from "../database/db.js";
import { Response } from "../utilities/response-format-utilities.js";

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
        res.status(500).json(Response.error("Internal server error"));
    }
}

async function checkTeamRequest(req, res, next) {
    try {
        const { teamId, teacherId } = req.params;

        // check team existence
        const team = await models.Team.findAll({
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
                    attributes: ["splId"],
                },
            ],
            where: {
                teamId,
            },
            nest: true,
            raw: true,
            attributes: ["teamId"],
        });

        if (team.length == 0) {
            res.status(400).json(Response.error("Team does not exist"));
            return;
        }

        const teamMembers = team.map((team) => team.TeamMembers.studentId);
        const { splId } = team[0].SPL;

        // check supervisor existence
        const supervisor = await models.StudentSupervisor.findAll({
            where: {
                studentId: {
                    [Op.in]: teamMembers,
                },
                splId,
            },
            raw: true,
            attributes: ["studentId"],
        });

        if (supervisor.length > 0) {
            res.status(400).json(Response.error("Already have a supervisor"));
            return;
        }

        // check teacher
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
        res.status(500).json(Response.error("Internal server error"));
    }
}

async function checkAcceptTeamRequest(req, res, next) {
    try {
        const { userId } = req.user;
        const { teamId } = req.params;

        // check team existence
        const team = await models.Team.findAll({
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
            raw: true,
            attributes: ["teamId"],
        });

        if (team.length == 0) {
            res.status(400).json(Response.error("Team does not exist"));
            return;
        }

        const teamMembers = team.map((team) => team.TeamMembers.studentId);
        const { splId } = team[0].SPL;

        // put spl to the req
        req.spl = team[0].SPL;

        // put teamMembers to the req
        req.teamMembers = teamMembers;

        // check supervisor existence
        const supervisor = await models.StudentSupervisor.findAll({
            where: {
                studentId: {
                    [Op.in]: teamMembers,
                },
                splId,
            },
            raw: true,
            attributes: ["studentId"],
        });

        if (supervisor.length > 0) {
            res.status(400).json(Response.error("Already have a supervisor"));
            return;
        }

        // check the team is requested or not
        const requested = await models.TeamRequest.findOne({
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

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal server error"));
    }
}

async function checkAcceptStudentRequest(req, res, next) {
    try {
        const { studentId } = req.params;
        const { userId } = req.user;

        console.log(studentId, userId);

        // check the student is requested or not
        const requested = await models.StudentRequest.findOne({
            where: {
                studentId,
                teacherId: userId,
            },
            attributes: ["studentId", "teacherId"],
            raw: true,
        });

        console.log(requested);

        if (!requested) {
            res.status(400).json(Response.error("Student did not requested you"));
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal server error"));
    }
}
