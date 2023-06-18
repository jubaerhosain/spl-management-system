import { Router } from "express";
const presentationRouter = Router();

import { commonValidationHandler } from "../validators/custom-validator.js";

import {
    createPresentationValidator,
    addPresentationEvaluatorValidator,
    removePresentationEvaluatorValidator,
} from "../validators/presentation-validators.js";

import {
    createPresentation,
    addPresentationEvaluator,
    removePresentationEvaluator,
} from "../controllers/presentation-controllers.js";

import {
    checkCreatePresentation,
    checkAddPresentationEvaluator,
    checkRemovePresentationEvaluator,
} from "../middlewares/presentation-middlewares.js";

// create a presentation event
presentationRouter.post(
    "/:splName",
    createPresentationValidator,
    commonValidationHandler,
    checkCreatePresentation,
    createPresentation
);

// add one or more presentation evaluator
presentationRouter.post(
    "/evaluator/:splName",
    addPresentationEvaluatorValidator,
    commonValidationHandler,
    checkAddPresentationEvaluator,
    addPresentationEvaluator
);

// remove a presentation evaluator
presentationRouter.delete(
    "/evaluator/:splId/:teacherId",
    removePresentationEvaluatorValidator,
    commonValidationHandler,
    checkRemovePresentationEvaluator,
    removePresentationEvaluator
);

export default presentationRouter;
