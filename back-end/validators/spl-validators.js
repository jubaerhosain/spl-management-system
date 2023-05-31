import { body_param, body } from "./custom-validator.js";
import { makeUnique } from "../utilities/common-utilities.js";
import { models } from "../database/db.js";
import createHttpError from "http-errors";

const splNameValidator = body_param("splName")
    .trim()
    .isIn(["spl1", "spl2", "spl3"])
    .withMessage("Must be in ['spl1', 'spl2', 'spl3']");

const academicYearValidator = body_param("academicYear")
    .trim()
    .matches(/^[0-9]{4}$/)
    .withMessage("Must be a 4 digit integer");

const createSPLValidator = [
    splNameValidator.bail().custom(async (splName) => {
        try {
            const spl = await models.SPL.findOne({
                where: {
                    splName: splName,
                    active: true,
                },
                raw: true,
            });

            if (spl) {
                throw new createHttpError(
                    400,
                    `${splName.toUpperCase()}, ${spl.academicYear} is already active`
                );
            }
        } catch (err) {
            if (!err.status) console.log(err);
            throw new Error(err.status ? err.message : "Error checking splName");
        }
    }),
    academicYearValidator,
];

const addSPLManagerValidator = [];
const removeSPLManagerValidator = [];


const removeStudentValidator = [];

export {
    splNameValidator,
    createSPLValidator,
    addSPLManagerValidator,
    removeSPLManagerValidator,
    removeStudentValidator,
};
