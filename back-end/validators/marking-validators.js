import { param, body_param } from "./custom-validator.js";
import { presentationIdValidator } from "./presentation-validators.js";
import { studentIdValidator } from "./student-validators.js";


const markIdValidator = body_param("markId").trim().isInt().withMessage("Must be an integer");
const markValidator = body_param("mark").trim().isNumeric().withMessage("Must be a number");

const addPresentationMarkValidator = [presentationIdValidator, studentIdValidator, markValidator];

const updatePresentationMarkValidator = [
    param("presentationMarkId").trim().isInt().withMessage("Must be an integer"),
    markValidator,
];

const addSupervisorMarkValidator = [studentIdValidator, markValidator];

const updateSupervisorMarkValidator = [markIdValidator, markValidator];

const addCodingMarkValidator = [studentIdValidator, markValidator];

const updateCodingMarkValidator = [markIdValidator, markValidator];

const addContinuousMarkValidator = [studentIdValidator, markValidator];

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
