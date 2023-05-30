import { Response, createMappedError } from "../utilities/response-format-utilities.js";

/**
 * Check if at least one field is provided or not in req.body
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function requiredOne(req, res, next) {
    if (Object.keys(req.body).length === 0) {
        req.res
            .status(400)
            .json(Response.error("At least one field should be provided", Response.FIELD_REQUIRED));
    } else {
        next();
    }
}

/**
 * Check if provided fields in req.body are allowed or not
 * @param {Array} allowedFields
 * @returns Middleware
 */
function checkAllow(allowedFields) {
    return async function (req, res, next) {
        const providedFields = Object.keys(req.body);
        const invalidFields = providedFields.filter((field) => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
            const error = createMappedError({
                param: "body",
                value: invalidFields,
                msg: "The following fields are invalid",
                location: "body",
            });
            req.res.status(400).json(error);
        } else {
            next();
        }
    };
}

export { requiredOne, checkAllow };
