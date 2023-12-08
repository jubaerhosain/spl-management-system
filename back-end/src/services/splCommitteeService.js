import NotificationRepository from "../repositories/NotificationRepository.js";
import SPLRepository from "../repositories/SPLRepository.js";
import StudentRepository from "../repositories/StudentRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import TeacherRepository from "../repositories/TeacherRepository.js";
import CustomError from "../utils/CustomError.js";
import splUtils from "../utils/splUtils.js";
import lodash from "lodash";
// import emailService from "../emailServices/emailService.js";

async function createSPLCommittee(data) {
    
}

async function addCommitteeHead(splId, data) {
    const user = await UserRepository.findByEmail(data.email);
    if (!user || user.userType != "teacher") {
        throw new CustomError("Invalid email", 400, {
            email: {
                msg: "committee head must be a teacher",
                value: data.email,
            },
        });
    }

    const spl = await SPLRepository.findById(splId);
    if (!spl) {
        throw new CustomError("spl does not exist", 400);
    } else if (spl.head) {
        throw new CustomError("already have a committee head", 400);
    }

    const head = { head: user.userId };
    await SPLRepository.updateSPL(splId, head);

    const notification = {
        userId: user.userId,
        content: `You have been assigned as Head of ${spl.splName}, ${spl.academicYear}.`,
        type: "info",
    };

    await NotificationRepository.createNotification(notification);
}

async function addSPLManager(splId, data) {
    const user = await UserRepository.findByEmail(data.email);
    if (!user || user.userType != "teacher") {
        throw new CustomError("Invalid email", 400, {
            email: {
                msg: "spl manager must be a teacher",
                value: data.email,
            },
        });
    }

    const spl = await SPLRepository.findById(splId);
    if (!spl) {
        throw new CustomError("spl does not exist", 400);
    } else if (spl.manager) {
        throw new CustomError("already have a spl manager", 400);
    }

    const manager = { manager: user.userId };
    await SPLRepository.updateSPL(splId, manager);

    const notification = {
        userId: user.userId,
        content: `You have been assigned as Manager of ${spl.splName}, ${spl.academicYear}.`,
        type: "info",
    };

    await NotificationRepository.createNotification(notification);
}

async function addCommitteeMember(splId, members) {
    const spl = await SPLRepository.findById(splId);
    if (!spl) throw new CustomError("spl does not exists", 400);

    const emails = members.map((member) => member.email);
    const users = await UserRepository.findAllExistedUserByEmail(emails);

    const validateIsAllTeacher = (users, emails) => {
        const isTeacherEmail = (users, email) => {
            for (const user of users) {
                if (email === user.email && user.userType == "teacher") return true;
            }
            return false;
        };

        const error = {};
        emails.forEach((email, index) => {
            if (!isTeacherEmail(users, email)) {
                if (!error[index]) {
                    error[index] = {};
                }
                error[index]["email"] = {
                    msg: "committee member must be a teacher",
                    value: email,
                };
            }
        });

        if (Object.keys(error).length === 0) return null;

        return error;
    };

    const error = validateIsAllTeacher(users, emails);
    if (error) throw new CustomError("committee members must be teacher", 400, error);

    // {email, userId}
    const membersWithId = emails.map((email) => {
        for (const user of users) {
            if (user.email == email) {
                return {
                    email: email,
                    userId: user.userId,
                };
            }
        }
    });

    const existedMemberIds = await SPLRepository.findAllMemberId(splId);
    const validateIsAlreadyMember = (membersWithId, existedMemberIds) => {
        const error = {};
        membersWithId.forEach((member, index) => {
            if (existedMemberIds.includes(member.userId)) {
                if (!error[index]) {
                    error[index] = {};
                }
                error[index]["email"] = {
                    msg: "already a member of this spl",
                    value: member.email,
                };
            }
        });

        if (Object.keys(error).length === 0) return null;

        return error;
    };

    const error1 = validateIsAlreadyMember(membersWithId, existedMemberIds);
    if (error1) throw new CustomError("already member", 400, error1);

    const newMembers = membersWithId.map((member) => {
        return { splId, teacherId: member.userId };
    });

    await SPLRepository.createMembers(newMembers);

    const notifications = [];
    newMembers.forEach((member) => {
        const notification = {
            userId: member.teacherId,
            content: `You have been assigned as a Member of ${spl.splName}, ${spl.academicYear}.`,
            type: "info",
        };
        notifications.push(notification);
    });

    await NotificationRepository.createMultipleNotification(notifications);
}

export default {
    createSPLCommittee,
    addCommitteeHead,
    addSPLManager,
    addCommitteeMember,
}