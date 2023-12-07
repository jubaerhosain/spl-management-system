import joi from "joi";
const Joi = joi.defaults((schema) => {
    return schema.options({
        abortEarly: false,
    });
});

const createPresentationSchema = Joi.object({
    splId: Joi.string().trim().uuid().required(),
    presentationNo: Joi.number().required(),
    details: Joi.string().trim().optional(),
});

export default {
    createPresentationSchema,
};
