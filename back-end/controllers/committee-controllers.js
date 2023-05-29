import createError from "http-errors";
import { sequelize, models, Op } from "../database/db.js";
import { sendEmail, sendMultipleEmail } from "../utilities/email-utilities.js";
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
        const { splId, splName } = req.spl;
        const { committeeHeadId, committeeMemberIds, splManager } = req.body;

        let splManagerId = await models.User.findOne({
            where: {
                email: splManager,
            },
            raw: true,
        });
        splManagerId = splManagerId.userId;

        // check if committee exists or not
        const exist = await models.SPLCommittee.findOne({
            where: {
                splId: splId,
            },
            raw: true,
        });

        if (exist) {
            res.status(400).json(Response.error("Committee already exists"));
            return;
        }

        const transaction = await sequelize.transaction();
        try {
            const committee = await models.SPLCommittee.create(
                {
                    splId: splId,
                    committeeHead: committeeHeadId,
                },
                {
                    transaction: transaction,
                }
            );

            await models.SPL.update(
                { splManager: splManagerId },
                {
                    where: {
                        splId,
                    },
                    transaction: transaction,
                }
            );

            const committeeMembers = [];
            for (const memberId of committeeMemberIds) {
                committeeMembers.push({
                    committeeId: committee.committeeId,
                    teacherId: memberId,
                });
            }

            await models.TeacherCommittee.bulkCreate(committeeMembers, {
                transaction: transaction,
            });

            await transaction.commit();

            res.status(200).json(
                Response.success(`${splName.toUpperCase()} committee created successfully`)
            );
        } catch (err) {
            await transaction.rollback();
            console.log(err);
            throw new createError(err.status || 500, err.message);
        }
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error";
        next(new createError(err.status || 500, message));
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
