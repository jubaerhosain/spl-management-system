import ProjectRepository from "../repositories/ProjectRepository.js";
import TeamRepository from "../repositories/TeamRepository.js";
import SPLRepository from "../repositories/SPLRepository.js";
import StudentRepository from "../repositories/StudentRepository.js";
import CustomError from "../utils/CustomError.js";

async function createProject(studentId, project) {
    const splId = project.splId;
    const spl = await SPLRepository.findById(splId);
    if (!spl) throw new CustomError("SPL does not exist", 400);

    const student = await StudentRepository.findById(studentId);
    if (!student) throw new CustomError("Student does not exist", 400);

    if (project.projectType == "individual") {
        const student = await ProjectRepository.createIndividualProject();
    } else if (project.projectType == "team") {
        const teamMembers = TeamRepository.getTeamMembers(teamId);
        await ProjectRepository.createTeamProject(project, contributorIds);
    } else {
        throw new CustomError(`Project type '${project.projectType}' is not allowed`, 400);
    }
}

export default {
    createProject,
};
