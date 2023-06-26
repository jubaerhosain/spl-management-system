import { body } from "express-validator";


const validateAddPresentationEvaluator = [
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


export {
    validateAddPresentationEvaluator,
};
