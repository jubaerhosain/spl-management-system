import StudentRepository from "../repositories/StudentRepository.js";
import { Response } from "../utils/responseUtils.js";

/**
 * Read studentId from req.params \
 * Response error if not exists
 */
async function checkStudentExistence(req, res, next) {
    try {
        const { studentId } = req.params;
        const exist = await StudentRepository.isStudentExist(studentId);
        if (!exist) {
            res.status(400).json(Response.error("Student not found", Response.BAD_REQUEST));
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

export default {
    /**
     * Read studentId from req.params \
     * Response error if not exists
     */
    checkStudentExistence,
};
