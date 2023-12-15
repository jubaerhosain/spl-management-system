import ProjectRepository from "../repositories/ProjectRepository.js";
import CustomError from "../utils/CustomError.js";

async function createProject(studentId, project) {
    if (project.projectType == "individual") {
        await ProjectRepository.createIndividualProject();
    } else if (project.projectType == "team") {
        await ProjectRepository.createTeamProject();
    } else {
        throw new CustomError(`Project type '${project.projectType}' is not allowed`, 400);
    }
}

export default {};
