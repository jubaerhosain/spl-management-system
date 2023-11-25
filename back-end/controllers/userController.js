import { GenericResponse } from "../utils/responseUtils.js";
import userValidator from "../validators/userValidator.js";
import userService from "../services/userService.js";
import CustomError from "../utils/CustomError.js";

async function createUser(req, res) {
    try {
        const { error } = userValidator.createUserSchema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("validation failed", error));

        // req.body.userType = "admin"; // from body
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

async function updateUser(req, res) {
    try {
        const { error } = userValidator.updateUserSchema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("validation failed", error));

        const user = req.user;
        await userService.updateUserAccount(user.userId, req.body);

        res.json(GenericResponse.success("Account updated successfully"));
    } catch (error) {
        console.log(err);
        res.status(500).json(GenericResponse.error("An error occurred during account creation"));
    }
}

async function deleteUser(req, res) {
    try {
        const { userId } = req.params;

        await userService.deleteUserAccount(userId);

        res.json(GenericResponse.success("Account deleted successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("An error occurred during account creation"));
    }
}

export default { createUser, updateUser, deleteUser };
