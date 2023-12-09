import splMarkValidator from "../validators/splMarkValidator.js";
import splMarkService from "../services/splMarkService.js";
import CustomError from "../utils/CustomError.js";
import { GenericResponse } from "../utils/responseUtils.js";

async function getSupervisorMark(req, res) {}

async function updateSupervisorMark(req, res) {
    try {
        const { error } = splMarkValidator.updateSupervisorMarkSchema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Invalid data", error));

        const { splId } = req.params;
        const userId = req.user?.userId;
        const { marks } = req.body;
        await splMarkService.updateSupervisorMark(userId, splId, marks);

        return res.json(GenericResponse.success("Mark updated successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function getCodingMark(req, res) {}

async function updateCodingMark(req, res) {
    try {
        const { error } = splMarkValidator.updateCodingMarkSchema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Invalid data", error));

        const { splId } = req.params;
        const { marks } = req.body;
        await splMarkService.updateCodingMark(splId, marks);

        return res.json(GenericResponse.success("Mark updated successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

export default {
    updateSupervisorMark,
    updateCodingMark,
};
