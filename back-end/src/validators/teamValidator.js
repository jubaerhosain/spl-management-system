import joi from "joi";
const Joi = joi.defaults((schema) => {
    return schema.options({
        abortEarly: false,
    });
});

const createTeamSchema = Joi.object({
    splId: Joi.string().trim().required(),
    teams: Joi.array()
        .min(1)
        .items(
            Joi.object({
                teamName: Joi.string().trim().min(4).required(),
                teamMembers: Joi.array().min(1).items({
                    email: Joi.string().trim().email().required(),
                }),
            })
        )
        .required(),
});

export default { createTeamSchema };
