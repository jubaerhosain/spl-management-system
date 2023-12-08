import SPLRepository from "../repositories/SPLRepository.js";
import TeamRepository from "../repositories/TeamRepository.js";
import StudentRepository from "../repositories/StudentRepository.js";
import CustomError from "../utils/CustomError.js";
import utils from "../utils/utils.js";
import NotificationRepository from "../repositories/NotificationRepository.js";

async function createTeam(data) {
    const { splId } = data;
    const spl = await SPLRepository.findById(splId);
    if (!spl || spl?.active == false) {
        throw new CustomError("SPL does not exist or has been ended", 400);
    } else if (spl?.splName != "spl2") {
        throw new CustomError("Team creation is only allowed for spl2", 400);
    }

    const { teams } = data;

    const assignedStudents = await StudentRepository.findAllStudentUnderSPL(splId);
    const validateAssignedToSPL = async (teams, splId) => {
        const isAssignedToSPL = (email) => {
            for (const student of assignedStudents) {
                if (student.email == email) return true;
            }
            return false;
        };

        const errors = {};
        teams.forEach((team, teamIndex) => {
            team.teamMembers.forEach((member, memberIndex) => {
                if (!isAssignedToSPL(member.email)) {
                    errors[`teams[${teamIndex}].teamMembers[${memberIndex}].email`] = {
                        msg: "student must be assigned to this spl",
                        value: member.email,
                    };
                }
            });
        });

        if (!utils.isObjectEmpty(errors)) return errors;
        return null;
    };

    let error = await validateAssignedToSPL(teams, splId);
    if (error) throw new CustomError("Must be assigned to this spl", 400, error);

    const allTeamMembers = await TeamRepository.findAllTeamMemberUnderSPL(splId);
    const validateAnotherTeamMember = async (teams, splId) => {
        const isAnotherTeamMember = (email) => {
            for (const student of allTeamMembers) {
                if (student.email == email) return true;
            }
            return false;
        };

        const errors = {};
        teams.forEach((team, teamIndex) => {
            team.teamMembers.forEach((member, memberIndex) => {
                if (isAnotherTeamMember(member.email)) {
                    errors[`teams[${teamIndex}].teamMembers[${memberIndex}].email`] = {
                        msg: "already member of another team of same spl",
                        value: member.email,
                    };
                }
            });
        });

        if (!utils.isObjectEmpty(errors)) return errors;
        return null;
    };

    error = await validateAnotherTeamMember(teams, splId);
    if (error) throw new CustomError("Must not be member of another team of same spl", 400, error);

    // normalize team data to create by a single query
    const findStudentId = (assignedStudents, email) => {
        for (const student of assignedStudents) {
            if (student.email == email) return student.studentId;
        }
    };

    const newTeams = [];
    teams.forEach((team, index) => {
        const temp = {};
        temp.teamName = team.teamName;
        temp.splId = splId;
        temp.details = team.details;

        const teamMembers = [];
        team.teamMembers.forEach((member, memberIndex) => {
            const studentId = findStudentId(assignedStudents, member.email);
            // map studentId
            teams[index].teamMembers[memberIndex].studentId = studentId;
            teamMembers.push({
                studentId: studentId,
            });
        });
        temp.Members = teamMembers;
        newTeams.push(temp);
    });

    await TeamRepository.createTeam(newTeams);

    const notifications = [];
    teams.forEach((team) => {
        team.teamMembers.forEach((member) => {
            const notification = {
                userId: member.studentId,
                content: `Your team <b>${team.teamName}</b> is created for ${spl.splName}, ${spl.academicYear}. Now you can request supervisor`,
                type: "info",
            };
            notifications.push(notification);
        });
    });

    await NotificationRepository.createMultipleNotification(notifications);
}

async function updateTeam(teamId, team) {}

export default {
    createTeam,
};
