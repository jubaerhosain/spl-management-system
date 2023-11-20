import Joi from "joi";

function transformError(joiError) {
    if (Joi.isError(joiError)) {
        const transformedError = {};
        joiError.details.forEach((detail) => {
            transformedError[`${detail.context.key}`] = {
                value: detail.context.value,
                msg: detail.message,
            };
        });
        return transformedError;
    } else {
        throw new Error("Invalid joi error instance");
    }
}

export default {
    transformError,
};