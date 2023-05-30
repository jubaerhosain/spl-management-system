"use strict";

export default (sequelize, DataTypes) => {
    const StudentTeacher_Supervisor = sequelize.define("StudentTeacher_Supervisors", {
        teacherId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Teachers",
                key: "teacherId",
            },
        },
        studentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Students",
                key: "studentId",
            },
        },
        splId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "SPLs",
                key: "splId",
            },
        },
    });

    return StudentTeacher_Supervisor;
};
