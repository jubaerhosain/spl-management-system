import { Response } from "../../utilities/response-format-utilities.js";

function notFoundHandler(req, res, next) {
    res.status(404).json(Response.error("Not Found", Response.NOT_FOUND));
}

function defaultErrorHandler(err, req, res, next) {
    // err = process.env.NODE_ENV == "development" ? err : {errors: err.message};
    res.status(500).json(Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR));
}

export { notFoundHandler, defaultErrorHandler };
