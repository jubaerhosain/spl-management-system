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
import Mark from "../models/Mark.js";
import PresentationMark from "../models/PresentationMark.js";
import ContinuousMark from "../models/ContinuousMark.js";
import OTP from "../models/OTP.js";

// junction tables
import StudentTeacher_Supervisor from "../models/junctions/StudentTeacher_Supervisor.js";
import StudentTeacher_Request from "../models/junctions/StudentTeacher_Request.js";
import StudentProject from "../models/junctions/StudentProject.js";
import StudentSPL from "../models/junctions/StudentSPL.js";
import StudentTeam from "../models/junctions/StudentTeam.js";
import TeacherSPL_PresentationEvaluator from "../models/junctions/TeacherSPL_PresentationEvaluator.js";
import TeacherSPL_CommitteeMember from "../models/junctions/TeacherSPL_CommitteeMember.js";
import TeamTeacher_Request from "../models/junctions/TeamTeacher_Request.js";

const options = { sequelize, DataTypes, Sequelize, Op };

const models = {
    // entity tables
    User: User(options),
    Teacher: Teacher(options),
    Student: Student(options),
    SPL: SPL(options),
    Team: Team(options),
    Project: Project(options),
    Notification: Notification(options),
    Notice: Notice(options),
    Presentation: Presentation(options),
    Mark: Mark(options),
    PresentationMark: PresentationMark(options),
    ContinuousMark: ContinuousMark(options),
    OTP: OTP(options),

    // junctions
    StudentTeam: StudentTeam(options),
    StudentProject: StudentProject(options),
    StudentTeacher_Supervisor: StudentTeacher_Supervisor(options),
    StudentTeacher_Request: StudentTeacher_Request(options),
    StudentSPL: StudentSPL(options),
    TeacherSPL_PresentationEvaluator: TeacherSPL_PresentationEvaluator(options),
    TeacherSPL_CommitteeMember: TeacherSPL_CommitteeMember(options),
    TeamTeacher_Request: TeamTeacher_Request(options),
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
        })
        .catch((err) => {
            console.error("Unable to connect to the database:", err);
        });

    sequelize.sync();
}

function dropAllTable() {
    sequelize.drop({ force: true });
}

export { Op, Sequelize, sequelize, models };
