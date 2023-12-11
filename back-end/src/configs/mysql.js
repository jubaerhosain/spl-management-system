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
import SPLCommittee from "../models/SPLCommittee.js";
import Team from "../models/Team.js";
import Project from "../models/Project.js";
import Notification from "../models/Notification.js";
import Notice from "../models/Notice.js";
import Presentation from "../models/Presentation.js";
import PresentationMark from "../models/PresentationMark.js";
import ContinuousMark from "../models/ContinuousMark.js";
import SupervisorRequest from "../models/SupervisorRequest.js";
import OTP from "../models/OTP.js";

// junction tables
import Supervisor from "../models/Supervisor.js";
import ProjectContributor from "../models/ProjectContributor.js";
import StudentSPL from "../models/StudentSPL.js";
import TeamMember from "../models/TeamMember.js";
import PresentationEvaluator from "../models/PresentationEvaluator.js";
import CommitteeMember from "../models/CommitteeMember.js";

const options = { sequelize, DataTypes, Sequelize, Op };

const models = {
    // entity tables
    User: User(options),
    Student: Student(options),
    Teacher: Teacher(options),
    SPL: SPL(options),
    SPLCommittee: SPLCommittee(options),
    Presentation: Presentation(options),
    PresentationMark: PresentationMark(options),
    ContinuousMark: ContinuousMark(options),
    Team: Team(options),
    Project: Project(options),
    Notification: Notification(options),
    Notice: Notice(options),
    OTP: OTP(options),
    SupervisorRequest: SupervisorRequest(options),
    
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
