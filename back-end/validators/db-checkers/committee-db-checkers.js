import createError from "http-errors";
import { models, Op } from "../../database/db.js";
import { body_param, body, param, validationResult } from "../custom-validator.js";
import { filterArray } from "../../utilities/common-utilities.js";

// import db checkers
import { teacherIdExistence } from "./teacher-db-checkers.js";

const committeeIdExistence = body_param("committeeId")
    .if((value, { req }) => validationResult(req).isEmpty())
    .custom(async (committeeId, { req }) => {
        try {
            const committee = await models.SPLCommittee.findOne({
                where: {
                    committeeId,
                },
                attributes: ["committeeId"],
                raw: true,
            });

            if (!committee) {
                const message = `Committee doesn't exists`;
                throw new createError(400, message);
            }
        } catch (err) {
            console.log(err);
            const message = err.status ? err.message : "Internal server error";
            throw new Error(message);
        }
    });

const createCommitteeDbCheck = [
    body_param("splName").custom(async (splName, { req }) => {
        try {
            const spl = await models.SPL.findOne({
                where: {
                    active: true,
                    splName: splName,
                },
                include: {
                    model: models.SPLCommittee,
                    attributes: ["committeeId"],
                },
                nest: true,
                raw: true,
                attributes: ["splId", "splName", "academicYear"],
            });

            if (!spl) {
                throw new createError(400, `There is no active ${splName.toUpperCase()}`);
            }

            // check this spl already has committee or not
            if (spl.SPLCommittee.committeeId) {
                const message = `Already has a committee`;
                throw new createError(400, message);
            }

            // delete SPLCommittee object
            delete spl.SPLCommittee;

            // put spl properties to the req
            req.spl = spl;
        } catch (err) {
            if (!err.status) console.log(err);
            const message = err.status ? err.message : "Internal server error.";
            throw new Error(message);
        }
    }),
];

const addCommitteeHeadDbCheck = [
    body_param("committeeId").custom(async (committeeId, { req }) => {
        try {
            const committee = await models.SPLCommittee.findOne({
                where: {
                    committeeId,
                },
                attributes: ["committeeId", "committeeHead"],
                raw: true,
            });

            if (!committee) {
                const message = `Committee doesn't exists`;
                throw new createError(400, message);
            }

            if (committee.committeeHead) {
                const message = `Already has a committee head`;
                throw new createError(400, message);
            }
        } catch (err) {
            if (!err.status) console.log(err);
            const message = err.status ? err.message : "Internal server error.";
            throw new Error(message);
        }
    }),
    teacherIdExistence,
];

const removeCommitteeHeadDbCheck = [
    body_param("committeeId")
        .if((value, { req }) => validationResult(req).isEmpty())
        .custom(async (committeeId, { req }) => {
            try {
                const committee = await models.SPLCommittee.findOne({
                    where: {
                        committeeId,
                    },
                    attributes: ["committeeId", "committeeHead"],
                    raw: true,
                });

                if (!committee) {
                    const message = `Committee doesn't exists`;
                    throw new createError(400, message);
                }

                if (!committee.committeeHead) {
                    const message = `Committee has no committee head`;
                    throw new createError(400, message);
                }
            } catch (err) {
                console.log(err);
                const message = err.status ? err.message : "Internal server error";
                throw new Error(message);
            }
        }),
];

const addCommitteeMemberDbCheck = [
    committeeIdExistence,
    body("members")
        .if((value, { req }) => validationResult(req).isEmpty())
        .custom(async (members, { req }) => {
            try {
                // check if the members are valid teachers or not
                const teachers = await models.User.findAll({
                    where: {
                        userId: {
                            [Op.in]: members,
                        },
                        userType: "teacher",
                        active: true,
                    },
                    raw: true,
                    attributes: ["userId", "name", "email"],
                });

                if (teachers.length !== members.length) {
                    throw new createError(400, "All member must be teacher");
                }

                // remove the teachers from member who are already members
                const committeeId = req.params.committeeId;
                let existedMembers = await models.TeacherCommittee.findAll({
                    where: {
                        committeeId,
                        teacherId: {
                            [Op.in]: members,
                        },
                    },
                    raw: true,
                    attributes: ["teacherId"],
                });

                existedMembers = existedMembers.map((teacher) => teacher.teacherId);

                // new members after removing existing members
                members = filterArray(members, existedMembers);

                if (members.length == 0) {
                    throw new createError(400, "Teachers are already member of that committee");
                }

                // put new members to req [making changes in original members instance]
                req.body.members.splice(0);
                for (const member of members) req.body.members.push(member);
            } catch (err) {
                console.log(err);
                const message = err.status ? err.message : "Internal server error";
                throw new Error(message);
            }
        }),
];

const removeCommitteeMemberDbCheck = [
    committeeIdExistence,
    body_param("teacherId")
        .if((value, { req }) => validationResult(req).isEmpty())
        .custom(async (teacherId, { req }) => {
            try {
                const member = await models.TeacherCommittee.findOne({
                    where: {
                        committeeId: req.params.committeeId,
                        teacherId,
                    },
                    attributes: ["committeeId", "teacherId"],
                    raw: true,
                });

                if (!member) {
                    const message = `Teacher is not member of that committee`;
                    throw new createError(400, message);
                }
            } catch (err) {
                console.log(err);
                const message = err.status ? err.message : "Internal server error";
                throw new Error(message);
            }
        }),
];

export {
    createCommitteeDbCheck,
    addCommitteeHeadDbCheck,
    removeCommitteeHeadDbCheck,
    addCommitteeMemberDbCheck,
    removeCommitteeMemberDbCheck,
};
