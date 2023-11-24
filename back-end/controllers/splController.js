import { GenericResponse } from "../utils/responseUtils.js";
import splService from "../services/splService.js";
import CustomError from "../utils/CustomError.js";
import splValidator from "../validators/splValidator.js";

async function createSPL(req, res) {
    try {
        const { error } = splValidator.createSPLSchema.validate(req.body);
        console.log(error.details);
        if (error) return res.status(400).json(GenericResponse.error("invalid data", error));

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
async function assignStudentToSPL(req, res) {}
async function addCommitteeMember(req, res) {}
async function addCommitteeHead(req, res) {}
async function addSPLManager(req, res) {}
async function deleteSPL(req, res) {}
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
