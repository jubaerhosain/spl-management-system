import { body_param, body } from "./custom-validator.js";

import { emailValidator } from "./user-validators.js";
import createHttpError from "http-errors";
import { models } from "../database/db.js";

const loginValidator = [
    emailValidator.bail().custom(async (email, { req }) => {
        try {
            const user = await models.User.findOne({
                where: {
                    email: email,
                    active: true,
                },
                raw: true,
                attributes: ["userId", "email", "userType", "password"],
            });

            if (!user) {
                throw new createHttpError(400, "Email does not exist");
            }

            // put the user into the req.body
            req.body.user = user;
        } catch (err) {
            if (!err.status) console.log(err);
            const message = err.status ? err.message : "Internal Server Error";
            throw new Error(message);
        }
    }),
    body("password").trim().notEmpty().withMessage("Password must be provided"),
];

export default { loginValidator };
