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
        splName: {
            type: DataTypes.STRING(4),
            allowNull: false,
            validate: {
                isIn: [["spl1", "spl2", "spl3"]],
            },
        },
    });

    return StudentTeacher_Supervisor;
};
