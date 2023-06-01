
async function authorizeStudentRequest(req, res, next) {
    try {
        const { userId } = req.user;

        // must be 4th year student and assigned to corresponding spl3
        const student = await models.Student.findOne({
            include: {
                model: models.SPL,
                through: {
                    model: models.StudentSPL,
                    attributes: [],
                },
                where: {
                    active: true,
                    splName: "spl3",
                },
                attributes: ["splId", "splName", "academicYear"],
                required: false,
            },
            where: {
                studentId: userId,
                curriculumYear: "4th",
            },
            attributes: ["studentId"],
            nest: true,
            raw: true,
        });

        if (!student) {
            res.status(400).json(Response.error("You are not allowed to request"));
            return;
        }

        // check assigned to spl3 or not
        if (!student.SPLs.splId) {
            res.status(400).json(Response.error("You are not assigned to SPL3"));
            return;
        }

        // put spl to the req
        req.spl = student.SPLs;

        // check if already has supervisor or not
        const supervisor = await models.StudentSupervisor.findOne({
            where: {
                studentId: userId,
                splId: student.SPLs.splId,
            },
            attributes: ["teacherId"],
            raw: true,
        });

        if (supervisor) {
            res.status(400).json(Response.error("Already has a supervisor"));
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

async function checkStudentRequest(req, res, next) {
    try {
        const { teacherId } = req.params;

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

        console.log(requested)

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
