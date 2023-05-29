import createError from "http-errors";
import { body_param, validationResult } from "../custom-validator.js";
import { models, Op } from "../../database/db.js";

// import db-checkers
import { splNameExistence } from "./spl-db-checkers.js";
import { teamIdExistence } from "./team-db-checkers.js";
import { teacherIdExistence } from "./teacher-db-checkers.js";


const randomizeSupervisorDbCheck = [splNameExistence];

const manualTeamAllocationDbCheck = [
    teamIdExistence,
    // check if team members already has supervisor or not
    body_param("teamId")
        .if((value, { req }) => validationResult(req).isEmpty())
        .custom(async (teamId, { req }) => {
            try {
                let members = await models.StudentTeam.findAll({
                    where: {
                        teamId,
                    },
                    raw: true,
                    attributes: ["studentId"],
                });

                members = members.map((member) => member.studentId);
                req.body.members = members;

                const { splId } = req.spl;

                const supervisor = await models.StudentSupervisor.findAll({
                    where: {
                        studentId: {
                            [Op.in]: members,
                        },
                        splId,
                    },
                    raw: true,
                    attributes: ["teacherId"],
                });

                if (supervisor.length > 0) {
                    throw new createError(400, "Already has supervisor");
                }
            } catch (err) {
                console.log(err);
                const message = err.status ? err.message : "Internal server error";
                throw new Error(message);
            }
        }),
    teacherIdExistence,
];

const manualStudentAllocationDbCheck = [
    // put spl of that student in req
    body_param("studentId")
        .if((value, { req }) => validationResult(req).isEmpty())
        .custom(async (studentId, { req }) => {
            try {
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
                        studentId,
                    },
                    raw: true,
                    nest: true,
                    attributes: ["studentId"],
                });

                if (!student) {
                    throw new createError("Student does not exist");
                }

                if (!student.SPLs.splId) {
                    throw new createError("Not assigned to any active SPL");
                }

                // put spl to the req
                req.spl = student.SPLs;

                // check already have supervisor or not
                const supervisor = await models.StudentSupervisor.findOne({
                    where: {
                        studentId,
                        splId: student.SPLs.splId,
                    },
                    raw: true,
                });

                if (supervisor) {
                    throw new createError("Already has supervisor");
                }
            } catch (err) {
                console.log(err);
                const message = err.status ? err.message : "Internal server error";
                throw new Error(message);
            }
        }),
    teacherIdExistence,
];

export { randomizeSupervisorDbCheck, manualTeamAllocationDbCheck, manualStudentAllocationDbCheck };
