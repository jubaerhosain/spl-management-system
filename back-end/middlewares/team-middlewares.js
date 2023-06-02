import { Response } from "../utilities/response-format-utilities.js";
import { models, Op } from "../database/db.js";
import { getCurriculumYear } from "../utilities/spl-utilities.js";
import { filterArray, findDuplicates } from "../utilities/common-utilities.js";
import lodash from "lodash";
import { where } from "sequelize";

async function checkCreateTeam(req, res, next) {
    try {
        const { retrievedMembers, spl } = req.body;
        const { splId, splName } = spl;

        const memberIds = retrievedMembers.map((member) => member.userId);

        // check if any students are already members of another team of same spl

        // teams of current spl
        const teams = await models.Team.findAll({
            where: {
                splId: splId,
            },
            raw: true,
            attributes: ["teamId"],
        });

        // students who are members of any team of same spl
        const alreadyMembers = await models.StudentTeam.findAll({
            where: {
                studentId: {
                    [Op.in]: memberIds,
                },
                teamId: {
                    [Op.in]: teams.map((team) => team.teamId),
                },
            },
            raw: true,
            attributes: ["studentId"],
        });

        const existedMemberIds = alreadyMembers.map((member) => member.studentId);
        const existingEmails = [];
        for (const member of retrievedMembers) {
            if (existedMemberIds.includes(member.userId)) existingEmails.push(member.email);
        }

        // return the emails who are already members of another team of same spl

        if (existingEmails.length > 0) {
            const message = `Following students are already members of another team of ${splName.toUpperCase()}`;
            res.status(400).json(Response.error(message, existingEmails));
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error"));
    }
}

/**
 * Check uniqueness of teamName, member emails
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function checkCreateTeamUniqueness(req, res, next) {
    try {
        const { teams } = req.body;

        // check teamName uniqueness
        // console.log(teams.map((team) => team.teamName));

        const duplicateTeamNames = findDuplicates(teams.map((team) => team.teamName));
        if (duplicateTeamNames.length > 0) {
            res.status(400).json(
                Response.error(
                    "Duplicate team names are not allowed",
                    Response.ARRAY_DATA,
                    duplicateTeamNames
                )
            );
            return;
        }

        // check email uniqueness
        // console.log(lodash.flatMap(teams, "teamMembers"));

        const duplicateEmails = findDuplicates(lodash.flatMap(teams, "teamMembers"));
        if (duplicateEmails.length > 0) {
            res.status(400).json(
                Response.error(
                    "Duplicate team member emails are not allowed",
                    Response.ARRAY_DATA,
                    duplicateEmails
                )
            );
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
 * Check existence of teamName, members are 3rd year student, \
 * assigned to spl2, members of another SPL of same team or not
 */
export async function checkCreateTeamExistence(req, res, next) {
    try {
        const { teams } = req.body;
        const { spl } = req.body;

        // check teamName existence
        const teamNames = teams.map((team) => team.teamName);

        const existedTeamsByName = await models.Team.findAll({
            where: {
                splId: spl.splId,
                teamName: {
                    [Op.in]: teamNames,
                },
            },
            raw: true,
            attributes: ["teamId", "teamName"],
        });

        if (existedTeamsByName.length > 0) {
            res.status(400).json(
                Response.error(
                    "Following team names are already taken for current SPL2",
                    Response.ARRAY_DATA,
                    existedTeams.map((team) => team.teamName)
                )
            );
            return;
        }

        // check all students are 3rd year student or not
        const teamMemberEmails = lodash.flatMap(teams, "teamMembers");

        const existedStudents = await models.User.findAll({
            include: {
                model: models.Student,
                where: {
                    curriculumYear: "3rd",
                },
                required: true,
                attributes: [],
            },
            where: {
                userType: "student",
                active: true,
                email: {
                    [Op.in]: teamMemberEmails,
                },
            },
            raw: true,
            nest: true,
            attributes: ["userId", "email"],
        });

        if (existedStudents.length !== teamMemberEmails.length) {
            const existedEmails = existedStudents.map((student) => student.email);
            const nonExistedEmails = filterArray(teamMemberEmails, existedEmails);
            res.status(400).json(
                Response.error(
                    "Following emails are not 3rd year students email",
                    Response.ARRAY_DATA,
                    nonExistedEmails
                )
            );
            return;
        }

        // check if all 3rd student team members are assigned to SPL2
        const assignedStudents = await models.Student.findAll({
            include: [
                {
                    model: models.SPL,
                    through: {
                        model: models.StudentSPL,
                        attributes: [],
                    },
                    where: {
                        splId: spl.splId,
                    },
                    attributes: [],
                    required: true,
                },
                {
                    model: models.User,
                    where: {
                        email: {
                            [Op.in]: teamMemberEmails,
                        },
                    },
                    required: true,
                    attributes: ["email"],
                },
            ],
            where: {
                curriculumYear: "3rd",
            },
            raw: true,
            nest: true,
            attributes: ["studentId"],
        });

        if (assignedStudents.length !== teamMemberEmails.length) {
            const assignedStudentEmails = assignedStudents.map((student) => student.User.email);
            const unassignedStudentEmails = filterArray(teamMemberEmails, assignedStudentEmails);
            res.status(400).json(
                Response.error(
                    "Following 3rd year students are not assigned to SPL2",
                    Response.ARRAY_DATA,
                    unassignedStudentEmails
                )
            );
            return;
        }

        // throw new Error("mY ERROR");

        // check if member of another team of same SPL or not
        const teamMemberIds = existedStudents.map((student) => student.userId);

        const existedTeamMembers = await models.Team.findAll({
            include: {
                model: models.Student,
                as: "TeamMembers",
                through: {
                    model: models.StudentTeam,
                    attributes: [],
                },
                where: {
                    studentId: {
                        [Op.in]: teamMemberIds,
                    },
                },
                required: true,
                attributes: ["studentId"],
            },
            where: {
                splId: spl.splId,
            },
            raw: true,
            nest: true,
            attributes: ["teamId"],
        });

        if (existedTeamMembers.length > 0) {
            const existedTeamMemberIds = existedTeamMembers.map(
                (team) => team.TeamMembers.studentId
            );

            const existedTeamMemberEmails = [];
            for (const student of existedStudents) {
                if (existedTeamMemberIds.includes(student.userId))
                    existedTeamMemberEmails.push(student.email);
            }

            res.status(400).json(
                Response.error(
                    "Following students are already member of another team of current SPL2",
                    Response.ARRAY_DATA,
                    existedTeamMemberEmails
                )
            );
            return;
        }

        console.log(existedTeamMembers);
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR)
        );
    }
}
