import { Response } from "../utils/responseUtils.js";
import teacherService from "../services/teacherService.js";

async function createTeacherAccount(req, res) {
    try {
        const { teachers } = req.body;

        await teacherService.createTeacherAccount(teachers);

        res.json(Response.success("Teacher accounts are created successfully"));
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(Response.error(err.message, Response.BAD_REQUEST));
        } else {
            console.log(err);
            res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
        }
    }
}

async function updateTeacherAccount(req, res) {
    try {
        const teacher = req.body;
        const { userId } = req.user;

        await teacherService.updateTeacherAccount(userId, teacher);

        res.json(Response.success("Account updated successfully"));
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(Response.error(err.message, Response.BAD_REQUEST));
        } else {
            console.log(err);
            res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
        }
    }
}

export default {
    createTeacherAccount,
    updateTeacherAccount,
};
