import { Response } from "../utils/responseUtils.js";

import teacherService from "../services/teacherService.js";

// import { writeCredentials } from "../utilities/file-utilities.js";
// import { Response } from "../utilities/response-format-utilities.js";
// import { generateHashedPassword } from "../utilities/password-utilities.js";

// createTeacherAccount
async function addTeacher(req, res) {
    try {
        const { teachers } = req.body;

        await teacherService.addTeacher(teachers);

        res.json(Response.success("Teacher accounts are created successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.SERVER_ERROR)
        );
    }
}

async function updateTeacher(req, res) {
    try {
        const teacher = req.body;
        const { userId } = req.user;

        const transaction = await sequelize.transaction();
        try {
            // update to User model
            await models.User.update(teacher, {
                where: {
                    userId: userId,
                },
                transaction: transaction,
            });

            // update to Teacher model
            await models.Teacher.update(teacher, {
                where: {
                    teacherId: userId,
                },
                transaction: transaction,
            });

            await transaction.commit();

            res.json(Response.success("Account is updated successfully"));
        } catch (err) {
            await transaction.rollback();
            console.log(err);
            throw new Error("Internal Server Error");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(
            Response.error("Internal Server Error", Response.SERVER_ERROR)
        );
    }
}

export default {
    addTeacher,
    updateTeacher,
}