import { Response } from "../utils/responseUtils.js";
import teacherService from "../services/teacherService.js";

async function addTeacher(req, res) {
    try {
        const { teachers } = req.body;

        await teacherService.addTeacher(teachers);

        res.json(Response.success("Teacher accounts are created successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

async function updateTeacher(req, res) {
    try {
        const teacher = req.body;
        const { userId } = req.user;

        await teacherService.updateTeacher(userId, teacher);

        res.json(Response.success("Account updated successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

export default {
    addTeacher,
    updateTeacher,
};
