/**
 * Response class to format Success and Error
 */
class Response {
    constructor(success, message, data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    /**
     * Success response with this.success = true
     * @param {*} message
     * @param {*} data
     * @returns Response Object
     */
    static success(message, data) {
        return new Response(true, message, data);
    }

    /**
     * Error response with this.success = false
     * @param {*} message
     * @param {*} data
     * @returns Response Object
     */
    static error(message, data) {
        return new Response(false, message, data);
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
