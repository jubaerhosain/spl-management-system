import joi from "joi";
const Joi = joi.defaults((schema) => {
    return schema.options({
        abortEarly: false,
    });
});

const updateSupervisorMarkSchema = Joi.object({
    marks: Joi.array()
        .min(1)
        .items({
            studentId: Joi.string().trim().uuid().required(),
            supervisorMark: Joi.number().required(),
        })
        .required(),
}).required();

const updateCodingMarkSchema = Joi.object({
    marks: Joi.array()
        .min(1)
        .items({
            studentId: Joi.string().trim().uuid().required(),
            codingMark: Joi.number().required(),
        })
        .required(),
}).required();

export default {
    updateSupervisorMarkSchema,
    updateCodingMarkSchema,
};
