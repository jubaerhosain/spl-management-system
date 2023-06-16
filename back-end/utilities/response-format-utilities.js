class MyError {
    constructor(message, errorCode, data) {
        this.success = false;
        this.message = message;
        this.errorCode = errorCode;
        this.data = data;
    }
}

class MySuccess {
    constructor(message, data, successCode) {
        this.success = true;
        this.message = message;
        this.data = data;
        this.successCode = successCode;
    }
}

class Response {
    // error codes will be used to manipulate error data in ui
    static EMAIL_EXIST = "EMAIL_EXIST";
    static ROLL_EXIST = "ROLL_EXIST";
    static REG_EXIST = "REG_EXIST";
    static SPL_EXIST = "SPL_EXIST";
    static FIELD_REQUIRED = "FIELD_REQUIRED";
    static FIELD_NOT_ALLOWED = "FIELD_NOT_ALLOWED";
    static SPL_DOES_NOT_EXIST = "SPL_DOES_NOT_EXIST";
    static INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";

    static UNAUTHORIZED = "UNAUTHORIZED";
    static NOT_FOUND = "NOT_FOUND";
    static ARRAY_DATA = "ARRAY_DATA";

    /**
     * Success response with this.success = true
     * @param {*} message
     * @param {*} data
     * @param {*} successCode
     * @returns MySuccess Object
     */
    static success(message, data, successCode) {
        return new MySuccess(message, data, successCode);
    }

    /**
     * Error response with this.success = false
     * @param {*} message
     * @param {*} errorCode
     * @param {*} data
     * @returns MyError Object
     */
    static error(message, errorCode, data) {
        return new MyError(message, errorCode, data);
    }
}

/**
 * Create custom mapped error message like express-validator errors
 * @param {Object} options 
 * 
 * @example
 * {
    "errors": {
        "name": {
            "value": "Jubaer-Hosain",
            "msg": "Hyphens are not allowed",
            "param": "name",
            "location": "body"
        }
    }
}
 */
function createMappedError(options) {
    const error = {
        errors: {},
    };

    error.errors[options.param] = {
        param: options.param,
    };

    if (options.value) {
        error.errors[options.param]["value"] = options.value;
    }

    if (options.msg) {
        error.errors[options.param]["msg"] = options.msg;
    }

    if (options.location) {
        error.errors[options.param]["location"] = options.location;
    }

    return error;
}

export { Response, createMappedError };
