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
    static normalizeJoiError(error) {
        const normalizedErrors = {};

        error.details.forEach((detail) => {
            if (!normalizedErrors[detail.context.label]) {
                let msg = detail.message.replace(/(\")/g, "");
                normalizedErrors[detail.context.label] = {
                    msg: msg.replace(/.*\.(.*)$/, "$1"),
                    value: error.context?.value,
                };
            }
        });

        return normalizedErrors;
    }

    static success(message, data) {
        return new SuccessResponse(message, data);
    }

    static error(message, error) {
        if (Joi.isError(error)) error = this.normalizeJoiError(error);

        return new ErrorResponse(message, error);
    }
}

export { GenericResponse };
