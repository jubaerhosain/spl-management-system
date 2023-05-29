/**
 * Response class to format Success and Error
 */
class Response {
    // success status codes

    // error status codes
    static EMAIL_EXIST = "EMAIL_EXIST";
    static ROLL_EXIST = "ROLL_EXIST";
    static REG_EXIST = "REG_EXIST";

    constructor(success, message, data, statusCode) {
        this.success = success;
        this.message = message;
        this.data = data;

        // status code for success or error
        this.statusCode = statusCode;
    }

    /**
     * Success response with this.success = true
     * @param {*} message
     * @param {*} data
     * @returns Response Object
     */
    static success(message, data, successCode) {
        return new Response(true, message, data, successCode);
    }

    /**
     * Error response with this.success = false
     * @param {*} message
     * @param {*} data
     * @returns Response Object
     */
    static error(message, data, errorCode) {
        return new Response(false, message, data, errorCode);
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
