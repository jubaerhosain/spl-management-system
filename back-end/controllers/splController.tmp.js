import { GenericResponse } from "../utils/responseUtils.js";
import splService from "../services/splService.js";
import commonUtils from "../utils/commonUtils.js";
import splUtils from "../utils/splUtils.js";
import CustomError from "../utils/CustomError.js";

async function createSPLCommittee(req, res) {
    try {
        const committee = req.body;

        const memberEmails = [committee.memberOneEmail, committee.memberTwoEmail];
        if (committee.memberThreeEmail) memberEmails.push(committee.memberThreeEmail);
        if (committee.memberFourEmail) memberEmails.push(committee.memberFourEmail);

        await splService.createSPLCommittee({
            splName: committee.splName,
            academicYear: committee.academicYear,
            headEmail: committee.headEmail,
            managerEmail: committee.managerEmail,
            memberEmails: commonUtils.makeUnique(memberEmails),
        });

        res.json(
            GenericResponse.success(
                `${splName.toUpperCase()}, ${academicYear} committee is created successfully`
            )
        );
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(GenericResponse.error(err.message, GenericResponse.BAD_REQUEST));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
        }
    }
}

async function assignStudents(req, res) {
    try {
        const { splName } = req.query;

        if (!splName) {
            throw new CustomError("splName must be provided in query param", 400);
        }

        await splService.assignStudents(splName);

        const curriculumYear = splUtils.getCurriculumYear(splName);
        res.json(
            GenericResponse.success(
                `${curriculumYear} year students are successfully assigned to ${splName.toUpperCase()}`
            )
        );
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(GenericResponse.error(err.message, GenericResponse.BAD_REQUEST));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
        }
    }
}

async function unassignStudent(req, res) {
    try {
        const { splId, studentId } = req.query;

        if (!splId || !studentId) {
            throw new CustomError(
                "Both `splId` and `studentId` must be provided in query parameters",
                200
            );
        }

        await splService.unassignStudent(splId, studentId);

        res.json({
            message: `Student unassigned successfully`,
        });
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(GenericResponse.error(err.message, GenericResponse.BAD_REQUEST));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
        }
    }
}

async function addCommitteeHead(req, res) {
    try {
        const { splId, teacherId } = req.query; // email ?

        res.json({
            message: `Committee head added successfully`,
        });
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(GenericResponse.error(err.message, GenericResponse.BAD_REQUEST));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
        }
    }
}

async function removedCommitteeHead(req, res) {
    try {
        const { splId, teacherId } = req.query;

        res.json({
            message: `SPL Manager added successfully`,
        });
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(GenericResponse.error(err.message, GenericResponse.BAD_REQUEST));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
        }
    }
}

async function addSPLManager(req, res) {
    try {
        const { splId, teacherId } = req.query;

        res.json({
            message: `SPL Manager added successfully`,
        });
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(GenericResponse.error(err.message, GenericResponse.BAD_REQUEST));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
        }
    }
}

async function removeSPLManager(req, res) {
    try {
        const { splId, teacherId } = req.query;

        res.json({
            message: `SPL Manager added successfully`,
        });
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(GenericResponse.error(err.message, GenericResponse.BAD_REQUEST));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
        }
    }
}

async function addCommitteeMember(req, res) {
    try {
        const { splId, teacherId } = req.query;

        res.json({
            message: `SPL Manager added successfully`,
        });
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(GenericResponse.error(err.message, GenericResponse.BAD_REQUEST));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
        }
    }
}

async function removeCommitteeMember(req, res) {
    try {
        const { splId, teacherId } = req.query;

        res.json({
            message: `SPL Manager added successfully`,
        });
    } catch (err) {
        console.log(err);
    }
}

// finalize a spl after its completion [by a particular spls' committee head]
async function finalizeSPL(req, res) {
    try {
        res.end(req.params.splName);
        // deactivate committee
        // upgrade student to next curriculum year
        // delete all temporary database related to this spl/spl students/spl teachers
    } catch (err) {
        if (err.status) {
            res.status(err.status).json(GenericResponse.error(err.message, GenericResponse.BAD_REQUEST));
        } else {
            console.log(err);
            res.status(500).json(GenericResponse.error("Internal Server Error", GenericResponse.SERVER_ERROR));
        }
    }
}

export default {
    createSPLCommittee,
    assignStudents,
    unassignStudent,
    addCommitteeHead,
    removedCommitteeHead,
    addSPLManager,
    removeSPLManager,
    addCommitteeMember,
    removeCommitteeMember,
    finalizeSPL,
};
