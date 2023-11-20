import { models, sequelize, Op } from "../database/db.js";
import { GenericResponse } from "../utilities/response-format-utilities.js";
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
        const { splId, splName } = req.body.spl;

        // check if already randomization done or not [if any student of this spl has supervisor]
        const hasSupervisor = await models.StudentTeacher_Supervisor.findOne({
            where: {
                splId,
            },
            attributes: ["splId"],
            raw: true,
        });

        if (hasSupervisor) {
            res.status(400).json(GenericResponse.error("Randomization already done for SPL1"));
            return;
        }

        // students of 'splName'
        const students = await models.StudentSPL.findAll({
            where: {
                splId,
            },
            raw: true,
            attributes: ["studentId"],
        });

        if (students.length == 0) {
            res.status(400).json(GenericResponse.error("There is no SPL1 student"));
            return;
        }

        // find all available teachers whose account are active
        const teachers = await models.User.findAll({
            include: {
                model: models.Teacher,
                where: {
                    available: true,
                },
                attributes: ["available"],
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

        if (teachers.length === 0) {
            res.status(400).json(GenericResponse.error("There is no available teacher"));
            return;
        }

        const studentIds = students.map((student) => student.studentId);
        const teacherIds = teachers.map((teacher) => teacher.userId);

        const studentTeachers = await randomize(studentIds, teacherIds);

        // add splId to studentTeachers
        for(const obj of studentTeachers) {
            obj.splId = splId;
        }

        // allocate supervisor
        await models.StudentTeacher_Supervisor.bulkCreate(studentTeachers);

        res.json(GenericResponse.success("Supervisor randomized successfully for SPL1 students"));
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.INTERNAL_SERVER_ERROR));
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

            res.json(GenericResponse.success("SPL2 supervisor allocated successfully"));
        } catch (err) {
            await transaction.rollback();
            console.log(err);
            res.status(500).json(GenericResponse.error("Internal server error"));
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("Internal server error"));
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
                GenericResponse.success(`${splName.toUpperCase()} supervisor allocated successfully`)
            );
        } catch (err) {
            await transaction.rollback();
            console.log(err);
            res.status(500).json(GenericResponse.error("Internal server error"));
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("Internal server error"));
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

        res.json(GenericResponse.success("Supervisor removed successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("Internal server error"));
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
            res.status(400).json(GenericResponse.error(`There is no active ${splName.toUpperCase()}`));
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
            res.status(400).json(GenericResponse.error("Invalid teacher"));
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
            res.status(400).json(GenericResponse.error("Invalid student"));
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
                    GenericResponse.error(`Student is not assigned to ${splName.toUpperCase()}`)
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

        res.json(GenericResponse.success("Supervisor assigned successfully"));
    } catch (error) {
        console.log(error);
        res.status(500).json(GenericResponse.error("Internal Server Error"));
    }
}

export {
    randomizeSupervisor,
    manuallyAllocateTeamSupervisor,
    manuallyAllocateStudentSupervisor,
    removeSupervisor,
    assignManuallyByEmail,
};
