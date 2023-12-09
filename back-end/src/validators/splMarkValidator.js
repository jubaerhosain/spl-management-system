import joi from "joi";
const Joi = joi.defaults((schema) => {
    return schema.options({
        abortEarly: false,
    });
});

const updateMarkSchema = Joi.object({
    marks: Joi.array()
        .min(1)
        .items({
            studentId: Joi.string().trim().uuid().required(),
            mark: Joi.number().required(),
        })
        .required(),
}).required();

export default {
    updateMarkSchema,
};
