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
import SPL from "../models/SPL.js";
import Team from "../models/Team.js";
import Project from "../models/Project.js";
import Notification from "../models/Notification.js";
import Notice from "../models/Notice.js";
import Presentation from "../models/Presentation.js";
import SPLMark from "../models/SPLMark.js";
import PresentationMark from "../models/PresentationMark.js";
import ContinuousMark from "../models/ContinuousMark.js";
import SupervisorRequest from "../models/SupervisorRequest.js";
import OTP from "../models/OTP.js";

// junction tables
import Supervisor from "../models/junctions/Supervisor.js";
import ProjectContributor from "../models/junctions/ProjectContributor.js";
import StudentSPL from "../models/junctions/StudentSPL.js";
import TeamMember from "../models/junctions/TeamMember.js";
import PresentationEvaluator from "../models/junctions/PresentationEvaluator.js";
import CommitteeMember from "../models/junctions/CommitteeMember.js";

const options = { sequelize, DataTypes, Sequelize, Op };

const models = {
    // entity tables
    User: User(options),
    Teacher: Teacher(options),
    Student: Student(options),
    SupervisorRequest: SupervisorRequest(options),
    SPL: SPL(options),
    SPLMark: SPLMark(options),
    Team: Team(options),
    Project: Project(options),
    Presentation: Presentation(options),
    PresentationMark: PresentationMark(options),
    ContinuousMark: ContinuousMark(options),
    Notification: Notification(options),
    Notice: Notice(options),
    OTP: OTP(options),

    // junctions
    TeamMember: TeamMember(options),
    ProjectContributor: ProjectContributor(options),
    Supervisor: Supervisor(options),
    StudentSPL: StudentSPL(options),
    PresentationEvaluator: PresentationEvaluator(options),
    CommitteeMember: CommitteeMember(options),
};

// initialize associations
Object.entries(models).forEach(([name, model]) => {
    if (model.associate) {
        model.associate(models);
    }
});

// Object.entries(models).forEach(([name, model]) => {
//     console.log(model.associations);
// });

console.log("Number of table: ", Object.keys(models).length);

// Test the connection
export function initializeMySqlConnection() {
    sequelize
        .authenticate()
        .then(() => {
            console.log("MySql connection has been established successfully.");
        })
        .catch((err) => {
            console.error("Unable to connect to the database:", err);
        });

    sequelize.sync();
}

function dropAllTable() {
    sequelize.drop({ force: true });
}

// dropAllTable();

export { Op, Sequelize, sequelize, models };
