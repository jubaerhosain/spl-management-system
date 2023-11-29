import { GenericResponse } from "../utils/responseUtils.js";
import splService from "../services/splService.js";
import CustomError from "../utils/CustomError.js";
import splValidator from "../validators/splValidator.js";

async function createSPL(req, res) {
    try {
        const { error } = splValidator.createSPLSchema.validate(req.body);
        if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

        await splService.createSPL(req.body);

        res.json(GenericResponse.success("SPL created successfully"));
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.status).json(GenericResponse.error(err.message, err.data));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("An error occurred while creating student account"));
        }
    }
}

async function getActiveSPL(req, res) {}
async function getAllSPL(req, res) {}
async function getSPL(req, res) {}
async function getAllStudentUnderSPL(req, res) {}
async function updateSPL(req, res) {}

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

async function deleteSPL(req, res) {}

async function assignStudentToSPL(req, res) {}
async function removeStudentFromSPL(req, res) {}

async function removeCommitteeMember(req, res) {}
async function removeCommitteeHead(req, res) {}
async function removeSPLManager(req, res) {}

export default {
    createSPL,
    getActiveSPL,
    getAllSPL,
    getSPL,
    getAllStudentUnderSPL,
    updateSPL,
    assignStudentToSPL,
    addCommitteeMember,
    addCommitteeHead,
    addSPLManager,
    deleteSPL,
    removeStudentFromSPL,
    removeCommitteeMember,
    removeCommitteeHead,
    removeSPLManager,
};
