import ProjectRepository from "../repositories/ProjectRepository.js";
import TeamRepository from "../repositories/TeamRepository.js";
import SPLRepository from "../repositories/SPLRepository.js";
import StudentRepository from "../repositories/StudentRepository.js";
import CustomError from "../utils/CustomError.js";

async function createProject(studentId, project) {
    const { splId } = project;
    const spl = await SPLRepository.findById(splId);
    if (!spl) throw new CustomError("SPL does not exist", 400);

    const student = await StudentRepository.findById(studentId);
    if (!student) throw new CustomError("Student does not exist", 400);

    if (project.projectType == "individual") {
        if (student.curriculumYear == "3rd") {
            throw new CustomError("3rd year student is not allowed to create individual project", 400);
        }

        const belongs = await SPLRepository.isStudentBelongsToSPL(splId, studentId);
        if (!belongs) throw new CustomError("Student does not belong to spl");

        const supervisorId = await StudentRepository.findSupervisorId(studentId, splId);
        if (!supervisorId) throw new CustomError("Don't have supervisor for this spl", 400);

        const has = await ProjectRepository.hasStudentProject(studentId, splId);
        if (has) throw new CustomError("Only one project is allowed in a spl", 400);

        project.teacherId = supervisorId;
        await ProjectRepository.create(project, [studentId]);
    } else if (project.projectType == "team") {
        if (student.curriculumYear != "3rd")
            throw new CustomError("Only 3rd year student is allowed to create team project", 400);

        const { teamId } = project;

        const team = await TeamRepository.findById(teamId);
        if (!team) throw new CustomError("Team does not exist", 400);

        if (team.splId != splId) throw new CustomError("Team does not belongs to spl", 400);

        if (!team.teacherId) throw new CustomError("Team must have a supervisor", 400);

        const hasProject = await ProjectRepository.hasTeamProject(teamId, splId);
        if (hasProject) throw new CustomError("Only one project is allowed in a spl", 400);

        const teamMembers = await TeamRepository.findAllTeamMember(teamId);

        const isMemberOfTeam = (studentId) => {
            for (const student of teamMembers) {
                if (student.userId == studentId) return true;
            }
            return false;
        };
        if (!isMemberOfTeam(studentId)) throw new CustomError("You are not member of that team", 401);

        project.teacherId = team.teacherId; // supervisor
        await ProjectRepository.create(
            project,
            teamMembers.map((student) => student.userId)
        );
    } else {
        throw new CustomError(`Project type '${project.projectType}' is not allowed`, 400);
    }

    // send notifications to the team members
}

export default {
    createProject,
};
