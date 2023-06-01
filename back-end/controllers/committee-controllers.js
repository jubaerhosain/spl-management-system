import createError from "http-errors";
import { sequelize, models, Op } from "../database/db.js";
import { Response } from "../utilities/response-format-utilities.js";

/**
 * Create a committee for a particular spl
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function createCommittee(req, res, next) {
    try {
        const { splId, splName } = req.body.spl;
        const { committeeHeadId, committeeMemberIds, splManagerId } = req.body;

        // console.log(req.body);

        // do from here
        const teacherSPL = [];
        for (const memberId of committeeMemberIds) {
            teacherSPL.push({
                splId: splId,
                teacherId: memberId,
            });
        }

        console.log(teacherSPL);

        // throw new Error("My Error");

        const transaction = await sequelize.transaction();
        try {
            await models.SPL.update(
                {
                    committeeHead: committeeHeadId,
                    splManager: splManagerId,
                },
                {
                    where: {
                        splId: splId,
                    },
                    transaction: transaction,
                }
            );

            await models.TeacherSPL_CommitteeMember.bulkCreate(teacherSPL, {
                transaction: transaction,
            });

            await transaction.commit();

            res.status(200).json(
                Response.success(`${splName.toUpperCase()} committee created successfully`)
            );
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
 * Update committee head of a spl committee
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function addCommitteeHead(req, res, next) {
    try {
        const { committeeId, teacherId } = req.params;

        const transaction = await sequelize.transaction();
        try {
            await models.SPLCommittee.update(
                {
                    committeeHead: teacherId,
                },
                {
                    where: {
                        committeeId,
                    },
                    transaction: transaction,
                }
            );

            // await sendEmailToCommitteeHead(committeeId, committeeHead.email);

            await transaction.commit();

            res.status(200).json({
                message: `Committee head added successfully`,
            });
        } catch (err) {
            await transaction.rollback();
            console.log(err);
            throw new createError(500);
        }
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal Server Error";
        next(new createError(err.status || 500, message));
    }
}

async function removeCommitteeHead(req, res, next) {
    try {
        const { committeeId } = req.params;
        await models.SPLCommittee.update(
            {
                committeeHead: null,
            },
            {
                where: {
                    committeeId,
                },
            }
        );

        res.json({
            message: `Committee head removed successfully`,
        });
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal Server Error";
        next(new createError(err.status || 500, message));
    }
}

async function addCommitteeMember(req, res, next) {
    try {
        const { committeeId } = req.params;
        const { members } = req.body;

        const committeeTeachers = [];
        for (const teacherId of members) {
            committeeTeachers.push({
                committeeId,
                teacherId,
            });
        }

        const transaction = await sequelize.transaction();
        try {
            await models.TeacherCommittee.bulkCreate(committeeTeachers, {
                transaction: transaction,
            });

            // await sendEMailToCommitteeMembers(
            //     committeeId,
            //     req.committeeMembers.map((member) => member.email)
            // );

            transaction.commit();

            let message = "Committee member added successfully";
            if (members.length > 1) message = "Committee members added successfully";

            res.status(200).json({
                message: message,
            });
        } catch (err) {
            await transaction.rollback();
            console.log(err);
            throw new createError(err.status || 500, err.message);
        }
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error.";
        next(new createError(err.status || 500, message));
    }
}

async function removeCommitteeMember(req, res, next) {
    try {
        const { committeeId, teacherId } = req.params;

        await models.TeacherCommittee.destroy({
            where: {
                committeeId: committeeId,
                teacherId: teacherId,
            },
        });

        res.status(200).json({
            message: `Committee member removed successfully`,
        });
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error.";
        next(new createError(err.status || 500, message));
    }
}

export {
    createCommittee,
    addCommitteeHead,
    removeCommitteeHead,
    addCommitteeMember,
    removeCommitteeMember,
};
