"use strict";

import { Sequelize, Op, DataTypes } from "sequelize";
import { dbConfig } from "../config/database-config.js";

// create sequelize instance
const sequelize = new Sequelize(dbConfig.database_name, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    define: {
        freezeTableName: true,
    },
    logging: false,
});

// db scaffolding
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Op = Op;

// all models would stored here
db.models = {};

// =================================================================================================
// tables
import User from "../models/users/User.js";
import Teacher from "../models/users/Teacher.js";
import Student from "../models/users/Student.js";
import SPL from "../models/spls/SPL.js";
import Team from "../models/teams/Team.js";
import Project from "../models/projects/Project.js";
import Notification from "../models/notifications/Notification.js";
import Presentation from "../models/presentations/Presentation.js";
import Mark from "../models/marks/Mark.js";
import PresentationMark from "../models/marks/PresentationMark.js";
import ContinuousMark from "../models/marks/ContinuousMark.js";

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

// users
db.models.User = User(sequelize, DataTypes, Op);
db.models.Teacher = Teacher(sequelize, DataTypes, Op);
db.models.Student = Student(sequelize, DataTypes, Op);
db.models.SPL = SPL(sequelize, DataTypes, Op);
db.models.Team = Team(sequelize, DataTypes, Op);
db.models.Project = Project(sequelize, DataTypes, Op);
db.models.Notification = Notification(sequelize, DataTypes, Op);
db.models.Presentation = Presentation(sequelize, DataTypes, Op);
db.models.Mark = Mark(sequelize, DataTypes, Op);
db.models.PresentationMark = PresentationMark(sequelize, DataTypes, Op);
db.models.ContinuousMark = ContinuousMark(sequelize, DataTypes, Op, Sequelize);

// junctions
db.models.StudentTeam = StudentTeam(sequelize, DataTypes, Op);
db.models.StudentProject = StudentProject(sequelize, DataTypes, Op);
db.models.UserNotification = UserNotification(sequelize, DataTypes, Op);
db.models.StudentTeacher_Supervisor = StudentTeacher_Supervisor(sequelize, DataTypes, Op);
db.models.StudentTeacher_Request = StudentTeacher_Request(sequelize, DataTypes, Op);
db.models.StudentSPL = StudentSPL(sequelize, DataTypes, Op);
db.models.TeacherSPL_PresentationEvaluator = TeacherSPL_PresentationEvaluator(
    sequelize,
    DataTypes,
    Op
);
db.models.TeacherSPL_CommitteeMember = TeacherSPL_CommitteeMember(sequelize, DataTypes, Op);
db.models.TeamTeacher_Request = TeamTeacher_Request(sequelize, DataTypes, Op);

// initialize associations
Object.entries(db.models).forEach(([name, model]) => {
    if (model.associate) {
        model.associate(db.models);
    }
});

console.log("Number of table: ", Object.keys(db.models).length);

// Test the connection
sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });

sequelize.sync();

// drop all tables
// sequelize.drop({ force: true });

const { models } = db;
export { db, Op, Sequelize, sequelize, models };
