import SPLRepository from "../repositories/SPLRepository.js";
import TeamRepository from "../repositories/TeamRepository.js";
import SupervisorRequestRepository from "../repositories/SupervisorRequestRepository.js";
import StudentRepository from "../repositories/StudentRepository.js";
import CustomError from "../utils/CustomError.js";
import utils from "../utils/utils.js";
import NotificationRepository from "../repositories/NotificationRepository.js";
import TeacherRepository from "../repositories/TeacherRepository.js";

async function createTeam(data) {
    const { splId } = data;
    const spl = await SPLRepository.findById(splId);
    if (!spl || spl?.active == false) {
        throw new CustomError("SPL does not exist or has been ended", 400);
    } else if (spl?.splName != "spl2") {
        throw new CustomError("Team creation is only allowed for spl2", 400);
    }

    const { teams } = data;

    const enrolledStudents = await StudentRepository.findAllStudentUnderSPL(splId);
    const validateEnrolledToSPL = async (teams, splId) => {
        const isAssignedToSPL = (email) => {
            for (const student of enrolledStudents) {
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
    let error = await validateEnrolledToSPL(teams, splId);
    if (error) throw new CustomError("Must be assigned to this spl", 400, error);

    const allTeamMemberEmails = await TeamRepository.findAllTeamMemberEmailUnderSPL(splId);
    const validateAnotherTeamMember = async (teams, splId) => {
        const isAnotherTeamMember = (email) => {
            for (const memberEmail of allTeamMemberEmails) {
                if (memberEmail == email) return true;
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
    const findStudentId = (enrolledStudents, email) => {
        for (const student of enrolledStudents) {
            if (student.email == email) return student.userId;
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
            const studentId = findStudentId(enrolledStudents, member.email);
            // map studentId
            teams[index].teamMembers[memberIndex].studentId = studentId;
            teamMembers.push({
                studentId: studentId,
            });
        });
        temp.Members = teamMembers;
        newTeams.push(temp);
    });

    await TeamRepository.create(newTeams);

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

async function requestTeacher(teamId, teacherId) {
    const team = await TeamRepository.findById(teamId);
    if (!team) throw new CustomError("Team does not exist", 400);

    // is team member ????

    const teacher = await TeacherRepository.findById(teacherId, { available: true });
    if (!teacher) throw new CustomError("Teacher does not exist or unavailable", 400);

    await SupervisorRequestRepository.createTeamRequest(teamId, teacherId, team.splId);
}

async function assignSupervisor(teamId, teacherEmail) {
    const team = await TeamRepository.findById(teamId);
    if (!team) throw new CustomError("Team does not exist", 400);

    if (team.supervisorId) throw new CustomError("Team already have supervisor", 400);

    const teacher = await TeacherRepository.findByEmail(teacherEmail, { available: true });
    if (!teacher) throw new CustomError("Teacher does not exist or unavailable", 400);

    const teamMembers = await TeamRepository.findAllTeamMember(teamId);
    const teamMemberIds = teamMembers.map(student => student.userId);

    const teacherId = teacher.userId;
    await TeamRepository.addSupervisor(teamId, teacherId, team.splId, teamMemberIds);

    await SupervisorRequestRepository.deleteAllTeamRequest(teamId);

    // notifications to the team members
}

export default {
    createTeam,
    requestTeacher,
    assignSupervisor,
};
