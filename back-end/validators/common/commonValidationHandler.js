import { Response } from "../../utils/responseUtils.js";

export async function commonValidationHandler(req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        res.status(400).json(
            Response.error("Validation failed", Response.VALIDATION_ERROR, mappedErrors)
        );
    }
}

export default commonValidationHandler;
