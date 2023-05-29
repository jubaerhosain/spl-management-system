import { body_param, body } from "./custom-validator.js";
import { IITEmailValidator } from "./common-validators.js";
import createHttpError from "http-errors";
import { models } from "../database/db.js";

const addAdminValidator = [
    body("name").trim().notEmpty().withMessage("Name cannot be empty"),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email format")
        .bail()
        .custom((email) => {
            if (!IITEmailValidator(email)) {
                throw new Error("Must be end with @iit.du.ac.bd");
            }
            return true;
        })
        .bail()
        .custom(async (email) => {
            try {
                const user = await models.User.findOne({
                    where: {
                        email: email,
                    },
                });

                if (user) {
                    throw new createHttpError(400, "Email already in use");
                }
            } catch (err) {
                if (!err.status) console.log(err);
                throw new Error(err.status ? err.message : "Internal Server Error");
            }
        }),
];

export { addAdminValidator };
