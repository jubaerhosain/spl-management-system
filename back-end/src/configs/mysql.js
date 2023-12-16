"use strict";

import { Sequelize, Op, DataTypes } from "sequelize";
import config from "./config.js";

const sequelize = new Sequelize(config.mysql.db_name, config.mysql.username, config.mysql.password, {
    host: config.mysql.host,
    dialect: config.mysql.dialect,
    define: {
        freezeTableName: true,
        defaultScope: {
            attributes: { exclude: ["createdAt", "updatedAt"] },
            raw: true,
        },
    },
    logging: false,
});

// entity tables
import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import StudentSPL_Enrollment from "../models/StudentSPL_Enrollment.js";
import SPL from "../models/SPL.js";
import Committee from "../models/Committee.js";
import CommitteeTeacher_Member from "../models/CommitteeTeacher_Member.js";
import Team from "../models/Team.js";
import TeamStudent_Member from "../models/TeamStudent_Member.js";
import Project from "../models/Project.js";
import ProjectStudent_Contributor from "../models/ProjectStudent_Contributor.js";
import Notification from "../models/Notification.js";
import Notice from "../models/Notice.js";
import SPLMark from "../models/SPLMark.js";
import Presentation from "../models/Presentation.js";
import PresentationTeacher_Evaluator from "../models/PresentationTeacher_Evaluator.js";
import PresentationMark from "../models/PresentationMark.js";
import ContinuousMark from "../models/ContinuousMark.js";
import SupervisorRequest from "../models/SupervisorRequest.js";
import OTP from "../models/OTP.js";

const options = { sequelize, DataTypes, Sequelize, Op };

const models = {
    User: User(options),
    Teacher: Teacher(options),
    Student: Student(options),
    StudentSPL_Enrollment: StudentSPL_Enrollment(options),
    SPL: SPL(options),
    Committee: Committee(options),
    CommitteeTeacher_Member: CommitteeTeacher_Member(options),
    Presentation: Presentation(options),
    PresentationTeacher_Evaluator: PresentationTeacher_Evaluator(options),
    SPLMark: SPLMark(options),
    PresentationMark: PresentationMark(options),
    ContinuousMark: ContinuousMark(options),
    Team: Team(options),
    TeamStudent_Member: TeamStudent_Member(options),
    Project: Project(options),
    ProjectStudent_Contributor: ProjectStudent_Contributor(options),
    Notification: Notification(options),
    Notice: Notice(options),
    OTP: OTP(options),
    SupervisorRequest: SupervisorRequest(options),
};

// initialize associations
Object.entries(models).forEach(([name, model]) => {
    if (model.associate) {
        model.associate(models);
    }
});

console.log("Number of table: ", Object.keys(models).length);

// Test the connection
export function initializeMySqlConnection() {
    sequelize
        .authenticate()
        .then(() => {
            console.log("MySql connection has been established successfully.");
            sequelize.sync();
        })
        .catch((err) => {
            console.error("Unable to connect to the database:", err);
        });
}

function dropAllTable() {
    sequelize.drop({ force: true });
}

// dropAllTable();
// initializeMySqlConnection();

export { Op, Sequelize, sequelize, models };
