import { GenericResponse } from "../utils/responseUtils.js";
import userService from "../services/userService.js";
import CustomError from "../utils/CustomError.js";
import Joi from "../utils/validator/Joi.js";
import { validateName, validateEmail, validateUserType } from "../utils/validator/JoiValidationFunction.js";

async function createUser(req, res) {
    try {
        const schema = Joi.object({
            name: Joi.string().trim().custom(validateName).required(),
            email: Joi.string().trim().email().custom(validateEmail).required(),
            userType: Joi.string().trim().custom(validateUserType).required(),
        }).required();

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

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
        const schema = Joi.object({
            name: Joi.string().trim().custom(validateName).required(),
            // add more fields
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

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
