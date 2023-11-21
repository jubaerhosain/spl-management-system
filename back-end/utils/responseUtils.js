import Joi from "joi";

class SuccessResponse {
    constructor(message, data) {
        this.success = true;
        this.message = message;
        this.data = data;
    }
}

class ErrorResponse {
    constructor(message, error) {
        this.success = false;
        this.message = message;
        this.error = error;
    }
}

class GenericResponse {
    static success(message, data) {
        return new SuccessResponse(message, data);
    }

    static JoiErrorToGenericError(error) {
        if (Joi.isError(error)) {
            const transformedErrorData = {};

            error.details.forEach((detail) => {
                transformedErrorData[detail.context.key] = {
                    msg: detail.message.replace(/(\")/g, ""),
                    value: detail.context.value,
                };
            });

            return transformedErrorData;
        } else {
            throw new Error("Invalid joi error instance");
        }
    }

    static JoiArrayErrorToGenericError(error) {
        if (Joi.isError(error)) {
            const result = {};

            error.details.forEach((detail) => {
                const key = detail.path[0]; // take array index

                if (!result[key]) {
                    result[key] = {};
                }

                result[key][detail.context.key] = {
                    msg: detail.message.replace(/(\[\d+\]\.)|(\")/g, ""),
                    value: detail.context.value,
                };
            });

            return result;
        } else {
            throw new Error("Invalid joi error instance");
        }
    }

    static error(message, error) {
        if (Joi.isError(error)) {
            if (error.details[0].path.length > 1) error = this.JoiArrayErrorToGenericError(error);
            else error = this.JoiErrorToGenericError(error);
        }

        return new ErrorResponse(message, error);
    }
}

export { GenericResponse };

/**
 * GenericError format
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
