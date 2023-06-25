import { body } from "express-validator";

import { validateSPLName, validateAcademicYear } from "./common/commonValidators.js";
import { commonValidationHandler } from "./common/commonValidationHandler.js";
import SPLRepository from "../repositories/SPLRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import CustomError from "../utils/CustomError.js";

const createSPLCommitteeValidator = [
    body("splName")
        .trim()
        .notEmpty()
        .withMessage("Must be provided")
        .bail()
        .custom((splName) => {
            return validateSPLName(splName);
        })
        .bail()
        .custom(async (splName) => {
            try {
                const exist = await SPLRepository.isExists(splName);
                if (exist) {
                    throw new CustomError(`${splName.toUpperCase()} already have a committee`, 400);
                }
            } catch (err) {
                if (err.status) throw new CustomError(err.message);
                else throw new CustomError("An error ocurred while validating");
            }
        }),

    body("academicYear")
        .trim()
        .notEmpty()
        .withMessage("Must be provided")
        .bail()
        .custom((academicYear) => {
            return validateAcademicYear(academicYear);
        }),

    body("committeeHeadEmail")
        .trim()
        .notEmpty()
        .withMessage("Must be provided")
        .bail()
        .custom(async (committeeHead) => {
            try {
                const exist = await UserRepository.isTeacherByEmail(committeeHead);
                if (!exist) throw new CustomError("Must be a teacher email", 400);
            } catch (err) {
                if (err.status) throw new CustomError(err.message);
                else throw new CustomError("An error ocurred while validating");
            }
        }),

    body("splManagerEmail")
        .trim()
        .notEmpty()
        .withMessage("Must be provided")
        .bail()
        .custom(async (splManager) => {
            try {
                const exist = await UserRepository.isTeacherByEmail(splManager);
                if (!exist) throw new CustomError("Must be a teacher email", 400);
            } catch (err) {
                if (err.status) throw new CustomError(err.message);
                else throw new CustomError("An error ocurred while validating");
            }
        }),

    body("committeeMemberOneEmail")
        .trim()
        .notEmpty()
        .withMessage("Must be provided")
        .bail()
        .custom(async (committeeMemberOne) => {
            try {
                const exist = await UserRepository.isTeacherByEmail(committeeMemberOne);
                if (!exist) throw new CustomError("Must be a teacher email", 400);
            } catch (err) {
                if (err.status) throw new CustomError(err.message);
                else throw new CustomError("An error ocurred while validating");
            }
        }),

    body("committeeMemberTwoEmail")
        .trim()
        .notEmpty()
        .withMessage("Must be provided")
        .bail()
        .custom(async (committeeMemberTwo) => {
            try {
                const exist = await UserRepository.isTeacherByEmail(committeeMemberTwo);
                if (!exist) throw new CustomError("Must be a teacher email", 400);
            } catch (err) {
                if (err.status) throw new CustomError(err.message);
                else throw new CustomError("An error ocurred while validating");
            }
        }),

    body("committeeMemberThreeEmail")
        .trim()
        .custom(async (committeeMemberThree) => {
            try {
                const exist = await UserRepository.isTeacherByEmail(committeeMemberThree);
                if (!exist) throw new CustomError("Must be a teacher email", 400);
            } catch (err) {
                if (err.status) throw new CustomError(err.message);
                else throw new CustomError("An error ocurred while validating");
            }
        })
        .optional(),

    body("committeeMemberFourEmail")
        .trim()
        .custom(async (committeeMemberFour) => {
            try {
                const exist = await UserRepository.isTeacherByEmail(committeeMemberFour);
                if (!exist) throw new CustomError("Must be a teacher email", 400);
            } catch (err) {
                if (err.status) throw new CustomError(err.message);
                else throw new CustomError("An error ocurred while validating");
            }
        })
        .optional(),

    commonValidationHandler,
];

const addSPLManagerValidator = [];
const removeSPLManagerValidator = [];

const removeStudentValidator = [];

export default {
    createSPLCommitteeValidator,
};
