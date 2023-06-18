import express from "express";
const committeeRouter = express.Router();

import { checkSPLActivenessByName } from "../middlewares/spl-middlewares.js";
import { commonValidationHandler } from "../validators/custom-validator.js";

import {
    createCommitteeValidator,
    addCommitteeHeadValidator,
    removeCommitteeHeadValidator,
    addCommitteeMemberValidator,
    removeCommitteeMemberValidator,
} from "../validators/committee-validators.js";

import {
    createCommittee,
    addCommitteeHead,
    removeCommitteeHead,
    addCommitteeMember,
    removeCommitteeMember,
} from "../controllers/committee-controllers.js";
import { checkSPLCommitteeCreated } from "../middlewares/committee-middlewares.js";

// Create a committee for a specific active spl
committeeRouter.post(
    "/:splName",
    checkSPLActivenessByName,
    checkSPLCommitteeCreated,
    createCommitteeValidator,
    commonValidationHandler,
    createCommittee
);

// add committee head (query params ids)
committeeRouter.post(
    "/head/:committeeId/:teacherId",
    addCommitteeHeadValidator,
    commonValidationHandler,
    // addCommitteeHeadDbCheck,
    commonValidationHandler,
    addCommitteeHead
);

// remove committee head
committeeRouter.delete(
    "/head/:committeeId",
    removeCommitteeHeadValidator,
    commonValidationHandler,
    // removeCommitteeHeadDbCheck,
    commonValidationHandler,
    removeCommitteeHead
);

// add spl manager

// remove splManager

// add one or more committee member by committee head
committeeRouter.post(
    "/member/:committeeId",
    addCommitteeMemberValidator,
    commonValidationHandler,
    // addCommitteeMemberDbCheck,
    commonValidationHandler,
    addCommitteeMember
);

// remove committee member by committee head
committeeRouter.delete(
    "/member/:committeeId/:teacherId",
    removeCommitteeMemberValidator,
    commonValidationHandler,
    // removeCommitteeMemberDbCheck,
    commonValidationHandler,
    removeCommitteeMember
);

export default committeeRouter;
