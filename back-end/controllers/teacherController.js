import { GenericResponse } from "../utils/responseUtils.js";
import teacherService from "../services/teacherService.js";
import fileUtils from "../utils/fileUtils.js";
import emailService from "../services/emailServices/emailService.js";
import CustomError from "../utils/CustomError.js";

async function createTeacherAccount(req, res) {
    try {
        const { teachers } = req.body;

        const credentials = await teacherService.createTeacherAccount(teachers);

        try {
            await emailService.sendAccountCreationEmail(credentials);
        } catch (err) {
            console.log(err);
            throw new CustomError(
                "Accounts are created successfully but failed to send email with credential",
                400
            );
        }

        try {
            fileUtils.writeCredentials(new Date() + "\n" + JSON.stringify(credentials));
        } catch (err) {
            console.log(err);
            throw new CustomError(
                "Accounts are created successfully but failed to wrote credentials tp file",
                400
            );
        }

        res.json(GenericResponse.success("Teacher accounts are created successfully"));
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(GenericResponse.error(err.message, GenericResponse.BAD_REQUEST));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
        }
    }
}

async function updateTeacherAccount(req, res) {
    try {
        const teacher = req.body;
        const { userId } = req.user;

        await teacherService.updateTeacherAccount(userId, teacher);

        res.json(GenericResponse.success("Account updated successfully"));
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(GenericResponse.error(err.message, GenericResponse.BAD_REQUEST));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
        }
    }
}

export default {
    createTeacherAccount,
    updateTeacherAccount,
};
