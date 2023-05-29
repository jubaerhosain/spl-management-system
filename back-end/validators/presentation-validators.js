import { body_param, body } from "./custom-validator.js";
import { makeUnique } from "../utilities/common-utilities.js";

import { splNameValidator, splIdValidator } from "../validators/spl-validators.js";
import { teacherIdValidator } from "./teacher-validators.js";


const presentationIdValidator = body_param("presentationId")
    .trim()
    .isInt()
    .withMessage("Must be an integer");

const createPresentationValidator = splNameValidator;

const addPresentationEvaluatorValidator = [
    splNameValidator,
    body("teachers")
        .isArray()
        .withMessage("Must be an array")
        .bail()
        .isLength({ min: 1 })
        .withMessage("Cannot be empty array")
        .bail()
        .custom(async (teachers, { req }) => {
            makeUnique(req.body.teachers);
            return true;
        }),
];

const removePresentationEvaluatorValidator = [splIdValidator, teacherIdValidator];

export {
    presentationIdValidator,
    createPresentationValidator,
    addPresentationEvaluatorValidator,
    removePresentationEvaluatorValidator,
};
