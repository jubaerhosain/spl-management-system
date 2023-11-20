import { GenericResponse } from "../../utils/responseUtils.js";

function notFoundHandler(req, res, next) {
    res.status(404).json(GenericResponse.error("Not Found", GenericResponse.NOT_FOUND));
}

export { notFoundHandler };
