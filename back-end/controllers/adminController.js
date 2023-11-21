
import { GenericResponse } from "../utils/responseUtils.js";
import adminValidator from "../validators/adminValidator.js";
import userService from "../services/userService.js";

async function createAdminAccount(req, res) {
    try {
        const { error } = adminValidator.createAdminSchema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("validation failed", error));

        const err = await userService.createUserAccount(req.body);
        if (err) return res.status(err.status).json(GenericResponse.error(err.message, err.data));

        res.json(GenericResponse.success("Account created successfully"));
    } catch (err) {
        console.log(err);
        res.status(500).json(GenericResponse.error("An error occurred during account creation"));
    }
}

async function updateAdminAccount(req, res) {}

async function removeAdminAccount(req, res) {}

export default { createAdminAccount, updateAdminAccount, removeAdminAccount };
