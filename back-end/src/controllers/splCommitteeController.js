import { GenericResponse } from "../utils/responseUtils.js";
import splCommitteeService from "../services/splCommitteeService.js";
import CustomError from "../utils/CustomError.js";
import Joi from "../utils/validator/Joi.js";

async function createSPLCommittee(req, res) {
    try {
        const schema = Joi.object({
            splId: Joi.string().trim().uuid().required(),
            head: Joi.string().trim().email().required(),
            manager: Joi.string().trim().email().required(),
            members: Joi.array()
                .min(1)
                .items({
                    email: Joi.string().trim().email().required(),
                })
                .required(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        await splCommitteeService.createSPLCommittee(req.body);

        return res.json(GenericResponse.success("Committee created successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function addCommitteeHead(req, res) {
    try {
        const schema = Joi.object({
            email: Joi.string().trim().email().required(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const { splId } = req.params;
        await splService.addCommitteeHead(splId, req.body);

        res.json(GenericResponse.success("committee head added successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}
async function removeCommitteeHead(req, res) {}

async function addSPLManager(req, res) {
    try {
        const schema = Joi.object({
            email: Joi.string().trim().email().required(),
        }).required();
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const { splId } = req.params;
        await splService.addSPLManager(splId, req.body);

        res.json(GenericResponse.success("SPL manager added successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function removeSPLManager(req, res) {}

async function addCommitteeMember(req, res) {
    try {
        const schema = Joi.object({
            members: Joi.array()
                .min(1)
                .items(
                    Joi.object({
                        email: Joi.string().trim().email().required(),
                    })
                )
                .required(),
        }).required();

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("Validation failed", error));

        const error1 = validateMemberEmailDuplicates(members);
        if (error1) return res.status(400).json(GenericResponse.error("Duplicate email not allowed", error1));

        const { splId } = req.params;
        const { members } = req.body;
        await splService.addCommitteeMember(splId, members);

        res.json(GenericResponse.success("Committee members added successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred"));
        }
    }
}

async function removeCommitteeMember(req, res) {}

export default {
    createSPLCommittee,
    addCommitteeHead,
    removeCommitteeHead,
    addSPLManager,
    removeSPLManager,
    addCommitteeMember,
    removeCommitteeMember,
};
