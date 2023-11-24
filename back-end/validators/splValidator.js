import SPLRepository from "../repositories/SPLRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import CustomError from "../utils/CustomError.js";
import joi from "joi";
const Joi = joi.defaults((schema) => {
    return schema.options({
        abortEarly: false,
    });
});

import { validateSPLName, validateAcademicYear, validateEmail } from "./common/commonValidators.js";

const createSPLSchema = Joi.object({
    splName: Joi.string().trim().custom(validateSPLName).required(),
    academicYear: Joi.string().trim().custom(validateAcademicYear).required(),
    head: Joi.string().trim().email().custom(validateEmail).required(),
    manager: Joi.string().trim().email().custom(validateEmail).required(),
    member1: Joi.string().trim().email().custom(validateEmail).required(),
    member2: Joi.string().trim().email().custom(validateEmail).required(),
    member3: Joi.string().trim().email().custom(validateEmail).required(),
    member4: Joi.string().trim().email().custom(validateEmail).optional(),
    member5: Joi.string().trim().email().custom(validateEmail).optional(),
    member6: Joi.string().trim().email().custom(validateEmail).optional(),
    member7: Joi.string().trim().email().custom(validateEmail).optional(),
});

const updateSPLSchema = Joi.object({
    splName: Joi.string().trim().custom(validateSPLName).required(),
    academicYear: Joi.string().trim().custom(validateAcademicYear).required(),
    committeeHead: Joi.string().trim().email().custom(validateEmail).required(),
    splManager: Joi.string().trim().email().custom(validateEmail).required(),
});

const addCommitteeHeadSchema = Joi.object({});
const addSPLManagerSchema = Joi.object({});
const addCommitteeMemberSchema = Joi.array().items(
    Joi.object({
        email: Joi.string().trim().email().custom(validateEmail).required(),
    })
);

// const validateCreateSPLCommittee = [
//     body("splName")
//         .trim()
//         .notEmpty()
//         .withMessage("Must be provided")
//         .bail()
//         .custom((splName) => {
//             return validateSPLName(splName);
//         })
//         .bail()
//         .custom(async (splName) => {
//             try {
//                 const exist = await SPLRepository.isExists(splName);
//                 if (exist) {
//                     throw new CustomError(`${splName.toUpperCase()} already have a committee`, 400);
//                 }
//             } catch (err) {
//                 if (err.status) throw new CustomError(err.message);
//                 else throw new CustomError("An error ocurred while validating");
//             }
//         }),

//     body("academicYear")
//         .trim()
//         .notEmpty()
//         .withMessage("Must be provided")
//         .bail()
//         .custom((academicYear) => {
//             return validateAcademicYear(academicYear);
//         }),

//     body("headEmail")
//         .trim()
//         .notEmpty()
//         .withMessage("Must be provided")
//         .bail()
//         .custom(async (committeeHead) => {
//             try {
//                 const exist = await UserRepository.isTeacherByEmail(committeeHead);
//                 if (!exist) throw new CustomError("Must be a teacher email", 400);
//             } catch (err) {
//                 if (err.status) throw new CustomError(err.message);
//                 else throw new CustomError("An error ocurred while validating");
//             }
//         }),

//     body("managerEmail")
//         .trim()
//         .notEmpty()
//         .withMessage("Must be provided")
//         .bail()
//         .custom(async (splManager) => {
//             try {
//                 const exist = await UserRepository.isTeacherByEmail(splManager);
//                 if (!exist) throw new CustomError("Must be a teacher email", 400);
//             } catch (err) {
//                 if (err.status) throw new CustomError(err.message);
//                 else throw new CustomError("An error ocurred while validating");
//             }
//         }),

//     body("memberOneEmail")
//         .trim()
//         .notEmpty()
//         .withMessage("Must be provided")
//         .bail()
//         .custom(async (committeeMemberOne) => {
//             try {
//                 const exist = await UserRepository.isTeacherByEmail(committeeMemberOne);
//                 if (!exist) throw new CustomError("Must be a teacher email", 400);
//             } catch (err) {
//                 if (err.status) throw new CustomError(err.message);
//                 else throw new CustomError("An error ocurred while validating");
//             }
//         }),

//     body("memberTwoEmail")
//         .trim()
//         .notEmpty()
//         .withMessage("Must be provided")
//         .bail()
//         .custom(async (committeeMemberTwo) => {
//             try {
//                 const exist = await UserRepository.isTeacherByEmail(committeeMemberTwo);
//                 if (!exist) throw new CustomError("Must be a teacher email", 400);
//             } catch (err) {
//                 if (err.status) throw new CustomError(err.message);
//                 else throw new CustomError("An error ocurred while validating");
//             }
//         }),

//     body("memberThreeEmail")
//         .trim()
//         .custom(async (committeeMemberThree) => {
//             try {
//                 const exist = await UserRepository.isTeacherByEmail(committeeMemberThree);
//                 if (!exist) throw new CustomError("Must be a teacher email", 400);
//             } catch (err) {
//                 if (err.status) throw new CustomError(err.message);
//                 else throw new CustomError("An error ocurred while validating");
//             }
//         })
//         .optional(),

//     body("memberFourEmail")
//         .trim()
//         .custom(async (committeeMemberFour) => {
//             try {
//                 const exist = await UserRepository.isTeacherByEmail(committeeMemberFour);
//                 if (!exist) throw new CustomError("Must be a teacher email", 400);
//             } catch (err) {
//                 if (err.status) throw new CustomError(err.message);
//                 else throw new CustomError("An error ocurred while validating");
//             }
//         })
//         .optional(),

//     commonValidationHandler,
// ];

export default {
    createSPLSchema,
    updateSPLSchema,
};
