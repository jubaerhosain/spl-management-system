import express from "express";
const interestedFieldRouter = express.Router();

import {
    addInterestedFieldValidator,
    interestedFieldExistenceValidator,
} from "../validators/interested-field-validators.js";

import { commonValidationHandler } from "../validators/custom-validator.js";
import { addInterestedField } from "../controllers/interested-field-controllers.js";

// add interested fields
interestedFieldRouter.post(
    "/",
    addInterestedFieldValidator,
    commonValidationHandler,
    interestedFieldExistenceValidator,
    addInterestedField
);

export { interestedFieldRouter };
