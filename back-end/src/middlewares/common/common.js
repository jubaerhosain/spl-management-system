import { GenericResponse } from "../../utils/responseUtils.js";

function defaultErrorHandler(err, req, res, next) {
    // err = process.env.NODE_ENV == "development" ? err : {errors: err.message};
    res.status(500).json(GenericResponse.error("Internal Server Error"));
}

function notFoundHandler(req, res, next) {
    res.status(404).json(GenericResponse.error("Path not found"));
}

export { defaultErrorHandler, notFoundHandler };
