import { param, body_param } from "./custom-validator.js";


const markValidator = body_param("mark").trim().isNumeric().withMessage("Must be a number");

const addPresentationMarkValidator = [, markValidator];

const updatePresentationMarkValidator = [
    param("presentationMarkId").trim().isInt().withMessage("Must be an integer"),
    markValidator,
];

const addSupervisorMarkValidator = [markValidator];

const updateSupervisorMarkValidator = [markValidator];

const addCodingMarkValidator = [markValidator];

const updateCodingMarkValidator = [markValidator];

const addContinuousMarkValidator = [ markValidator];

const updateContinuousMarkValidator = [
    param("continuousMarkId").trim().isInt().withMessage("Must be an integer"),
    markValidator,
];

export {
    addPresentationMarkValidator,
    updatePresentationMarkValidator,
    addSupervisorMarkValidator,
    updateSupervisorMarkValidator,
    addCodingMarkValidator,
    updateCodingMarkValidator,
    addContinuousMarkValidator,
    updateContinuousMarkValidator,
};
