import createError from "http-errors";
import { models, Op } from "../database/db.js";

async function addInterestedField(req, res, next) {
    try {
        const { fields } = req.body;

        const interestedFields = [];
        for (const fieldName of fields) {
            interestedFields.push({
                fieldName,
            });
        }

        // add to the database
        await models.InterestedField.bulkCreate(interestedFields);

        res.json({
            message: "Your interested fields are added successfully.",
        });
    } catch (err) {
        console.log(err);
        const message = err.status ? err.message : "Internal server error.";
        next(new createError(err.status || 500, message));
    }
}

export { addInterestedField };
