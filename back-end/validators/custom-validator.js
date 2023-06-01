/**
 * @file This file contains various validation functions based on express-validator
 */

import { body, param, query, buildCheckFunction, validationResult } from "express-validator";

/**
 * A variant of check() that checks the body and params
 */
const body_param = buildCheckFunction(["body", "params"]);
const body_param_query = buildCheckFunction(["body", "params", "query"]);

/**
 * Common express validation handler
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function commonValidationHandler(req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        res.status(400).json({
            errors: mappedErrors,
        });
    }
}

export { body, param, query, body_param, body_param_query, validationResult, commonValidationHandler };
