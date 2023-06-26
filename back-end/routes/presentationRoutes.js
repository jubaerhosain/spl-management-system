import { Router } from "express";
const presentationRouter = Router();

import presentationController from "../controllers/presentationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

// query params {splId}
presentationRouter.post(
    "/",
    authMiddleware.checkAuthentication,
    authMiddleware.isTeacher, // then is committee Head
    presentationController.createPresentationEvent
);

// add one or more presentation evaluator
// presentationRouter.post(
//     "/evaluator/:splName",
//     addPresentationEvaluatorValidator,
//     commonValidationHandler,
//     checkAddPresentationEvaluator,
//     addPresentationEvaluator
// );

// remove a presentation evaluator
// presentationRouter.delete(
//     "/evaluator/:splId/:teacherId",
//     removePresentationEvaluatorValidator,
//     commonValidationHandler,
//     checkRemovePresentationEvaluator,
//     removePresentationEvaluator
// );

export default presentationRouter;
