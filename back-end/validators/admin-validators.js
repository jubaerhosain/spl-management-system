import { body } from "./custom-validator.js";
import createHttpError from "http-errors";
import { models } from "../database/db.js";
import { isIITEmail } from "./user-validators.js";

const addAdminValidator = [
    body("name").trim().notEmpty().withMessage("Name cannot be empty"),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email format")
        .bail()
        .custom((email) => {
            if (isIITEmail(email)) return true;
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
