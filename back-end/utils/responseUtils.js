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
    // to show error message in UI
    static UNAUTHORIZED = "UNAUTHORIZED";
    static NOT_FOUND = "NOT_FOUND";
    static ARRAY_DATA = "ARRAY_DATA";
    static BAD_REQUEST = "BAD_REQUEST";
    static VALIDATION_ERROR = "VALIDATION_ERROR"; // form validation error by express-validator
    static SERVER_ERROR = "SERVER_ERROR";

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
 * Create custom validation error message like
 * @param {Object} options 
 * 
 * @example
 *  {
        "name": {
            "msg": "Hyphens are not allowed",
        },
        "age": {
            msg: "Must be a number"
        }
    }
 */
function createValidationError(options) {}

export { Response, createValidationError };
