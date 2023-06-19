import createError from "http-errors";
import { body } from "express-validator";
import { models, Op } from "../../database/db.js";

/**
 * Check existence of interested fields in the database
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function interestedFieldExistenceValidator(req, res, next) {
    try {
        const { fields } = req.body;

        const existedFields = await models.InterestedField.findAll({
            where: {
                fieldName: {
                    [Op.in]: fields,
                },
            },
            attributes: ["fieldName"],
            raw: true,
        });

        if (existedFields.length > 0) {
            res.status(400).json({
                errors: {
                    message: "Following fields are already exists.",
                    data: existedFields.map((field) => field.fieldName),
                },
            });
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error.";
        next(new createError(err.status || 500, message));
    }
}

const addInterestedFieldValidator = [
    body("fields")
        .isArray()
        .withMessage("Must be an array.")
        .bail()
        .isLength({ min: 1 })
        .withMessage("Cannot be empty."),
    body("fields.*")
        .trim()
        .notEmpty()
        .withMessage("Cannot be empty.")
        .bail()
        .matches(/^[ a-zA-Z()-]+$/)
        .withMessage("Only characters, spaces, hyphens, and parenthesis are allowed."),
];

export { addInterestedFieldValidator, interestedFieldExistenceValidator };
