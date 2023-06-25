"use strict";

import { Sequelize, Op, DataTypes } from "sequelize";
import config from "../config/config.js";

// create sequelize instance
const sequelize = new Sequelize(
    config.mysql.db_name,
    config.mysql.username,
    config.mysql.password,
    {
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
    }
);

// =================================================================================================
// tables
import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import SPL from "../models/SPL.js";
import Team from "../models/Team.js";
import Project from "../models/Project.js";
import Notification from "../models/Notification.js";
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
import UserNotification from "../models/junctions/UserNotification.js";
import TeamTeacher_Request from "../models/junctions/TeamTeacher_Request.js";

// =================================================================================================

const models = {
    // users
    User: User(sequelize, DataTypes, Op),
    Teacher: Teacher(sequelize, DataTypes, Op),
    Student: Student(sequelize, DataTypes, Op),
    SPL: SPL(sequelize, DataTypes, Op),
    Team: Team(sequelize, DataTypes, Op),
    Project: Project(sequelize, DataTypes, Op),
    Notification: Notification(sequelize, DataTypes, Op),
    Presentation: Presentation(sequelize, DataTypes, Op),
    Mark: Mark(sequelize, DataTypes, Op),
    PresentationMark: PresentationMark(sequelize, DataTypes, Op),
    ContinuousMark: ContinuousMark(sequelize, DataTypes, Op, Sequelize),
    OTP: OTP(sequelize, DataTypes, Op),

    // junctions
    StudentTeam: StudentTeam(sequelize, DataTypes, Op),
    StudentProject: StudentProject(sequelize, DataTypes, Op),
    UserNotification: UserNotification(sequelize, DataTypes, Op),
    StudentTeacher_Supervisor: StudentTeacher_Supervisor(sequelize, DataTypes, Op),
    StudentTeacher_Request: StudentTeacher_Request(sequelize, DataTypes, Op),
    StudentSPL: StudentSPL(sequelize, DataTypes, Op),
    TeacherSPL_PresentationEvaluator: TeacherSPL_PresentationEvaluator(sequelize, DataTypes, Op),
    TeacherSPL_CommitteeMember: TeacherSPL_CommitteeMember(sequelize, DataTypes, Op),
    TeamTeacher_Request: TeamTeacher_Request(sequelize, DataTypes, Op),
};

// initialize associations
Object.entries(models).forEach(([name, model]) => {
    if (model.associate) {
        model.associate(models);
    }
});

// console.log("Number of table: ", Object.keys(models).length);

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

// drop all tables
// sequelize.drop({ force: true });

export { Op, Sequelize, sequelize, models };
