import { models, Op, sequelize } from "../database/mysql.js";
import { Response } from "../utils/responseUtils.js";
import splService from "../services/splService.js";
import commonUtils from "../utils/commonUtils.js";
import splUtils from "../utils/splUtils.js";
import CustomError from "../utils/CustomError.js";

async function createSPLCommittee(req, res) {
    try {
        const {
            splName,
            academicYear,
            committeeHeadEmail,
            splManagerEmail,
            committeeMemberOneEmail,
            committeeMemberTwoEmail,
            committeeMemberThreeEmail,
            committeeMemberFourEmail,
        } = req.body;

        const committeeMemberEmails = [committeeMemberOneEmail, committeeMemberTwoEmail];
        if (committeeMemberThreeEmail) committeeMemberEmails.push(committeeMemberThreeEmail);
        if (committeeMemberFourEmail) committeeMemberEmails.push(committeeMemberFourEmail);

        const committee = {
            splName,
            academicYear,
            committeeHeadEmail,
            splManagerEmail,
            committeeMemberEmails: commonUtils.makeUnique(committeeMemberEmails),
        };

        await splService.createSPLCommittee(committee);

        res.json(
            Response.success(
                `${splName.toUpperCase()}, ${academicYear} committee is created successfully`
            )
        );
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

async function assignMultipleStudent(req, res) {
    try {
        const { splName } = req.query;

        if(!splName) {
            throw new CustomError("splName must be provided in query param", 400);
        }

        const curriculumYear = splUtils.getCurriculumYear(splName);

        await splService.assignMultipleStudent(splName);

        res.json(
            Response.success(
                `${curriculumYear} year students are successfully assigned to ${splName.toUpperCase()}`
            )
        );
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(err.status).json(Response.error(err.message));
        } else {
            res.status(500).json(
                Response.error("Internal Server Error", Response.SERVER_ERROR)
            );
        }
    }
}

async function unassignStudent(req, res) {
    try {
        const { splId, studentId } = req.query;

        console.log(splId, studentId)

        if (!splId || !studentId) {
            throw new CustomError(
                "Both `splId` and `studentId` must be provided in query parameters",
                400
            );
        }

        await splService.unassignStudent(splId, studentId);

        res.json({
            message: `Student unassigned successfully`,
        });
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(err.status).json(Response.error(err.message, Response.BAD_REQUEST));
        } else {
            res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
        }
    }
}

// async function addSPLManager(req, res, next) {
//     try {
//         const { splId, teacherId } = req.params;

//         await models.SPL.update(
//             {
//                 splManager: teacherId,
//             },
//             {
//                 where: {
//                     splId,
//                 },
//             }
//         );

//         res.json({
//             message: `SPL Manager added successfully`,
//         });
//     } catch (err) {
//         console.log(err);
//         const message = err.status ? err.message : "Internal server error.";
//         next(new createError(err.status || 500, message));
//     }
// }

// /**
//  * Remove spl manager from a particular spl
//  * @param {*} req
//  * @param {*} res
//  * @param {*} next
//  */
// async function removeSPLManager(req, res, next) {
//     try {
//         const { splId } = req.params;

//         // update to null instead of deleting the spl
//         await models.SPL.update(
//             {
//                 splManager: null,
//             },
//             {
//                 where: {
//                     splId,
//                 },
//             }
//         );

//         res.json({
//             message: `SPL Manager removed successfully`,
//         });
//     } catch (err) {
//         console.log(err);
//         const message = err.status ? err.message : "Internal server error";
//         next(new createError(err.status || 500, message));
//     }
// }

// // finalize a spl after its completion [by a particular spls' committee head]
// async function finalizeSPL(req, res, next) {
//     try {
//         res.end(req.params.splName);
//         // deactivate committee
//         // upgrade student to next curriculum year
//         // delete all temporary database related to this spl/spl students/spl teachers
//     } catch (err) {
//         console.log(err);
//         next(new createError(err.status || 500, "An error occurred finalize the spls"));
//     }
// }

export default {
    createSPLCommittee,
    assignMultipleStudent,
    unassignStudent,
};
