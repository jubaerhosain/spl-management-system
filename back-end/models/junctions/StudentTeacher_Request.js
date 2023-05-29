"use strict";

export default (sequelize, DataTypes) => {
    const StudentTeacher_Request = sequelize.define("StudentTeacher_Requests", {
        studentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Students",
                key: "studentId",
            },
        },
        teacherId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Teachers",
                key: "teacherId",
            },
        },
    });

    return StudentTeacher_Request;
};
