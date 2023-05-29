import { models, sequelize, Op } from "../database/db.js";
import { Response } from "../utilities/response-format-utilities.js";
import { randomize } from "../utilities/sup-allocation-utilities.js";

/**
 * Randomize supervisors to the unallocated students for spl1
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function randomizeSupervisor(req, res, next) {
    try {
        const { splId, splName } = req.spl;

        // check if already randomization done or not [if any student of this spl has supervisor]
        let hasSupervisor = await models.StudentSupervisor.findOne({
            where: {
                splId,
            },
            attributes: ["splId"],
            raw: true,
        });

        if (hasSupervisor) {
            res.status(400).json(Response.error("Randomization already done"));
            return;
        }

        // students of spl1
        let students = await models.StudentSPL.findAll({
            where: {
                splId,
            },
            raw: true,
            attributes: ["studentId"],
        });
        students = students.map((student) => student.studentId);

        if (students.length == 0) {
            res.status(400).json(Response.error("There is no SPL1 student"));
            return;
        }

        // find all available teachers whose account are active
        let teachers = await models.User.findAll({
            include: {
                model: models.Teacher,
                where: {
                    available: true,
                },
                attributes: [],
                required: true,
            },
            where: {
                active: true,
                userType: "teacher",
            },
            raw: true,
            nest: true,
            attributes: ["userId"],
        });
        teachers = teachers.map((teacher) => teacher.userId);

        if (teachers.length === 0) {
            res.status(400).json(Response.error("There is no available teacher"));
            return;
        }

        const studentSupervisors = await randomize(students, teachers, splId);

        // allocate supervisor
        await models.StudentSupervisor.bulkCreate(studentSupervisors);

        res.json(Response.success("Supervisor randomized successfully for SPL1 students"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

/**
 * Do request by spl2 team
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function teamRequest(req, res, next) {
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
async function acceptTeamRequest(req, res, next) {
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
async function studentRequest(req, res, next) {
    try {
        const { teacherId } = req.params;
        const studentId = req.user.userId;

        // check if already requested this teacher or not
        const requested = await models.StudentRequest.findOne({
            where: {
                studentId,
                teacherId,
            },
            raw: true,
            attributes: ["teacherId"],
        });

        if (requested) {
            res.status(400).json(Response.error("Already requested this teacher"));
            return;
        }

        // do request to the teacher
        await models.StudentRequest.create({
            studentId,
            teacherId,
        });

        // trigger a notification after the request??

        res.json(Response.success("Request sent successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal server error"));
    }
}

/**
 * Accept spl3 student
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function acceptStudentRequest(req, res, next) {
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

/**
 * Allocate supervisor to spl2 team manually
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function manuallyAllocateTeamSupervisor(req, res, next) {
    try {
        const { splId } = req.spl;
        const { members } = req.body;
        const { teamId, teacherId } = req.params;

        // assign supervisor and delete all the requests of that team
        const transaction = await sequelize.transaction();
        try {
            const studentSupervisors = [];
            for (const studentId of members) {
                studentSupervisors.push({
                    studentId,
                    teacherId,
                    splId,
                });
            }

            // add supervisor
            await models.StudentSupervisor.bulkCreate(studentSupervisors, {
                transaction: transaction,
            });

            // delete all requests of that team
            await models.TeamRequest.destroy({
                where: {
                    teamId,
                },
                transaction: transaction,
            });

            await transaction.commit();

            res.json(Response.success("SPL2 supervisor allocated successfully"));
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
 * Allocate supervisor to individual students manually
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function manuallyAllocateStudentSupervisor(req, res, next) {
    try {
        const { splId, splName, academicYear } = req.spl;
        const { studentId, teacherId } = req.params;

        // add supervisor and delete all request of that student
        const transaction = await sequelize.transaction();
        try {
            // add supervisor
            await models.StudentSupervisor.create(
                {
                    studentId,
                    teacherId,
                    splId,
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

            res.json(
                Response.success(`${splName.toUpperCase()} supervisor allocated successfully`)
            );
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
 * remove supervisor of a particular student
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function removeSupervisor(req, res, next) {
    try {
        const { studentId, teacherId } = req.params;

        await models.StudentSupervisor.destroy({
            where: {
                studentId,
                teacherId,
            },
        });

        res.json(Response.success("Supervisor removed successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal server error"));
    }
}

async function rejectStudentRequest(req, res, next) {
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

async function rejectTeamRequest(req, res, next) {
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

async function cancelTeamRequestByStudent(req, res, next) {
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

async function cancelStudentRequestByStudent(req, res, next) {
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

async function assignManuallyByEmail(req, res, next) {
    try {
        const { splName, supervisorEmail, studentEmail } = req.body;

        const spl = await models.SPL.findOne({
            where: {
                splName,
                active: true,
            },
            raw: true,
        });

        if (!spl) {
            res.status(400).json(Response.error(`There is no active ${splName.toUpperCase()}`));
            return;
        }

        const teacher = await models.User.findOne({
            where: {
                userType: "teacher",
                email: supervisorEmail,
            },
            raw: true,
        });

        if (!teacher) {
            res.status(400).json(Response.error("Invalid teacher"));
            return;
        }

        const student = await models.User.findOne({
            where: {
                userType: "student",
                email: studentEmail,
            },
            raw: true,
        });

        if (!student) {
            res.status(400).json(Response.error("Invalid student"));
            return;
        }

        // check assigned to spl or not
        const assigned = await models.StudentSPL.findOne({
            where: {
                studentId: student.userId,
                splId: spl.splId,
            },
        });

        if (!assigned) {
            if (!spl) {
                res.status(400).json(
                    Response.error(`Student is not assigned to ${splName.toUpperCase()}`)
                );
                return;
            }
        }

        // assign supervisor
        await models.StudentSupervisor.create({
            studentId: student.userId,
            splId: spl.splId,
            teacherId: teacher.userId,
        });

        res.json(Response.success("Supervisor assigned successfully"));
    } catch (error) {
        console.log(error);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

export {
    randomizeSupervisor,
    teamRequest,
    acceptTeamRequest,
    studentRequest,
    acceptStudentRequest,
    manuallyAllocateTeamSupervisor,
    manuallyAllocateStudentSupervisor,
    removeSupervisor,
    rejectStudentRequest,
    rejectTeamRequest,
    cancelTeamRequestByStudent,
    cancelStudentRequestByStudent,
    assignManuallyByEmail,
};
