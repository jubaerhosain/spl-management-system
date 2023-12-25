import { sequelize, models, Op } from "../configs/mysql.js";
import utils from "../utils/utils.js";

async function findById(requestId) {
    const request = await models.SupervisorRequest.findByPk(requestId, {
        raw: true,
    });
    return request;
}

async function deleteRequest(requestId) {
    await models.SupervisorRequest.destroy({ where: { requestId } });
}

async function findAllSupervisor(studentId) {
    // with spl data
}

async function findCurrentSupervisor(studentId, splId) {}

async function createStudentRequest(studentId, teacherId, splId) {
    await models.SupervisorRequest.create({ studentId, teacherId, splId });
}

async function deleteAllStudentRequest(studentId) {
    await models.SupervisorRequest.destroy({ where: { studentId } });
}

async function createTeamRequest(teamId, teacherId, splId) {}

async function deleteAllTeamRequest(teamId) {
    await models.SupervisorRequest.destroy({ where: { teamId } });
}

async function findAllSupervisorRequest(teacherId) {
    let requests = await models.SupervisorRequest.findAll({
        include: [
            {
                model: models.Student,
                include: {
                    model: models.User,
                },
                required: false,
                attributes: {
                    exclude: ["studentId"],
                },
            },
            {
                model: models.Team,
                // include members ???
                required: false,
            },
            {
                model: models.SPL,
                required: false,
            },
        ],
        where: { teacherId },
        attributes: ["requestId"],
        raw: true,
        nest: true,
    });

    if (requests.length == 0) return [];
    requests = requests.map((request) => {
        const User = request.Student.User;
        delete request.Student.User;
        request.Student = {
            ...User,
            ...request.Student,
        };

        if (utils.areAllKeysNull(request.Student)) delete request.Student;
        else if (utils.areAllKeysNull(request.Team)) delete request.Team;

        return request;
    });

    return requests;
}

async function isStudentRequestSent(studentId, teacherId) {
    const request = await models.SupervisorRequest.findOne({ where: { studentId, teacherId } });
    return request ? true : false;
}

async function isTeamRequestSent(teamId, teacherId) {
    const request = await models.SupervisorRequest.findOne({ where: { teamId, teacherId } });
    return request ? true : false;
}

export default {
    // request related
    findById,
    createStudentRequest,
    deleteAllStudentRequest,
    createTeamRequest,
    deleteAllTeamRequest,
    findAllSupervisorRequest,
    deleteRequest,

    // utility methods
    isStudentRequestSent,
    isTeamRequestSent,
};
