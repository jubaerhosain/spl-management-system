import SPLRepository from "../repositories/SPLRepository.js";
import StudentRepository from "../repositories/StudentRepository.js";
import SPLMarkRepository from "../repositories/SPLMarkRepository.js";
import CustomError from "../utils/CustomError.js";

async function updateSupervisorMark(userId, splId, marks) {
    const spl = await SPLRepository.findById(splId);
    if (!spl) throw new CustomError("SPL does not exist", 400);

    const splStudentIds = await StudentRepository.findAllStudentIdUnderSPL(splId);
    for (const id of marks.map((mark) => mark.studentId)) {
        if (!splStudentIds.includes(id)) {
            throw new CustomError("Student does not under SPL", 400);
        }
    }

    const supervisorStudentIds = await StudentRepository.findAllStudentIdUnderSupervisor(splId, supervisorId);
    for (const id of marks.map((mark) => mark.studentId)) {
        if (!supervisorStudentIds.includes(id)) {
            throw new CustomError("Student does not under Supervisor", 400);
        }
    }

    await SPLMarkRepository.updateSupervisorMark(splId, marks);

}

export default {
    updateSupervisorMark,
};
