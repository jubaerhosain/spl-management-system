import Joi from "joi";

class GenericResponse {
    static UNAUTHORIZED = "UNAUTHORIZED";
    static FORBIDDEN = "FORBIDDEN";
    static NOT_FOUND = "NOT_FOUND";
    static SERVER_ERROR = "SERVER_ERROR";
    static BAD_REQUEST = "BAD_REQUEST";
    static VALIDATION_ERROR = "VALIDATION_ERROR";

    constructor(success, message, data, statusCode) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
    }

    static joiErrorToGenericError(joiError) {
        if (Joi.isError(joiError)) {
            const transformedErrorData = {};
            joiError.details.forEach((detail) => {
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

    static success(message, successData, successCode) {
        return new GenericResponse(true, message, successData, successCode);
    }

    static error(message, errorData, errorCode) {
        if (Joi.isError(errorData)) {
            errorData = this.joiErrorToGenericError(errorData);
        }
        return new GenericResponse(false, message, errorData, errorCode);
    }
}

export { GenericResponse };

console.log(GenericResponse.success("This is a success response", "data", "code"));

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
