import { GenericResponse } from "../utils/responseUtils.js";
import splCommitteeService from "../services/splCommitteeService.js";
import CustomError from "../utils/CustomError.js";
import splCommitteeValidator from "../validators/splCommitteeValidator.js";

async function createSPLCommittee(req, res) {
    try {
        const { error } = splCommitteeValidator.createCommitteeSchema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

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
        const { error } = splValidator.addCommitteeHeadSchema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

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
        const { error } = splValidator.addSPLManagerSchema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

        const { splId } = req.params;
        await splService.addSPLManager(splId, req.body);

        res.json(GenericResponse.success("spl manager added successfully"));
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
        const { members } = req.body;
        if (!members || members.length < 1)
            return res.status(400).json(GenericResponse.error("at least one member must be provided"));

        const { error } = splValidator.addCommitteeMemberSchema.validate(members);
        if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

        const error1 = splValidator.validateMemberEmailDuplicates(members);
        if (error1) return res.status(400).json(GenericResponse.error("duplicate email", error1));

        const { splId } = req.params;
        await splService.addCommitteeMember(splId, members);

        res.json(GenericResponse.success("committee members added successfully"));
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
