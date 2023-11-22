import { GenericResponse } from "../utils/responseUtils.js";
import adminValidator from "../validators/adminValidator.js";
import userService from "../services/userService.js";
import CustomError from "../utils/CustomError.js";

async function createAdminAccount(req, res) {
    try {
        const { error } = adminValidator.createAdminSchema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("validation failed", error));

        req.body.userType = "admin";
        await userService.createUserAccount(req.body);

        res.json(GenericResponse.success("Account created successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function updateAdminAccount(req, res) {
    try {
        const { error } = adminValidator.updateAdminSchema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("validation failed", error));

        const user = req.user;
        await userService.updateUserAccount(user.userId, req.body);

        res.json(GenericResponse.success("Account updated successfully"));
    } catch (error) {
        console.log(err);
        res.status(500).json(GenericResponse.error("An error occurred during account creation"));
    }
}

async function deleteAdminAccount(req, res) {
    try {
        const { userId } = req.params;

        await userService.deleteUserAccount(userId);

        res.json(GenericResponse.success("Account deleted successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("An error occurred during account creation"));
    }
}

export default { createAdminAccount, updateAdminAccount, deleteAdminAccount };
