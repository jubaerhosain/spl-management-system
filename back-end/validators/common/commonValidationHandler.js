import { GenericResponse } from "../../utils/responseUtils.js";
import { validationResult } from "express-validator";

export async function commonValidationHandler(req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        res.status(200).json(
            GenericResponse.error("Validation failed", GenericResponse.VALIDATION_ERROR, mappedErrors)
        );
    }
}

export default commonValidationHandler;
