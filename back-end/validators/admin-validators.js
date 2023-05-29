import { body } from "./custom-validator.js";
import createHttpError from "http-errors";
import { models } from "../database/db.js";

const addAdminValidator = [
    body("name").trim().notEmpty().withMessage("Name cannot be empty"),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email format")
        .bail()
        .matches(/.+@iit\.du\.ac\.bd$/)
        .withMessage("Must be end with @iit.du.ac.bd")
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
