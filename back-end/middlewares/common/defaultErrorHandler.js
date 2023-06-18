import { Response } from "../../utils/responseUtils.js";

function defaultErrorHandler(err, req, res, next) {
    // err = process.env.NODE_ENV == "development" ? err : {errors: err.message};
    res.status(500).json(Response.error("Internal Server Error", Response.INTERNAL_SERVER_ERROR));
}

export { defaultErrorHandler };
