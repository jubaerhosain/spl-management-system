import { GenericResponse } from "../../utils/responseUtils.js";

function defaultErrorHandler(err, req, res, next) {
    // err = process.env.NODE_ENV == "development" ? err : {errors: err.message};
    res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
}

export { defaultErrorHandler };
