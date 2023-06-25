import { Response } from "../utils/responseUtils.js";
import { models, Op } from "../database/mysql.js";
import SPLRepository from "../repositories/SPLRepository.js";

/**
 * Reads splName from req.params
 */
async function isSPLExist(req, res, next) {
    try {
        const { splName } = req.params;
        const exist = await SPLRepository.isExists(splName);

        if (!exist) {
            res.status(400).json(Response.error(`Theres is not active ${splName.toUpperCase()}`));
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(Response.error("Internal Server Error", Response.SERVER_ERROR));
    }
}

export default { isSPLExist };
