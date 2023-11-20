import Joi from "joi";

class GenericResponseModel {
    constructor(success, message, data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}

class GenericResponse {
    static success(message, data) {
        new GenericResponseModel(true, message, data);
    }

    static JoiErrorToGenericError(error) {
        if (Joi.isError(error)) {
            const transformedErrorData = {};
            error.details.forEach((detail) => {
                transformedErrorData[`${detail.context.key}`] = {
                    msg: detail.message,
                    value: detail.context.value,
                };
            });
            return transformedErrorData;
        } else {
            throw new Error("Invalid joi error instance");
        }
    }

    static error(message, data) {
        if (Joi.isError(data)) {
            data = this.JoiErrorToGenericError(data);
        }

        return new GenericResponseModel(false, message, data);
    }
}

export { GenericResponse };

/**
 * Generic ErrorData format
 * @example
 *  {
        name: {
            msg: "Hyphens are not allowed",
            value: "jubaer-hosain" 
        },
        age: {
            msg: "Must be a number"
            value: "24"
        }
    }
 */
