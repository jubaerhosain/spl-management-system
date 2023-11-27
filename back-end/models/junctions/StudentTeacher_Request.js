"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const StudentTeacher_Request = sequelize.define("StudentTeacher_Requests", {
        studentId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Students",
                key: "studentId",
            },
        },
        teacherId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Teachers",
                key: "teacherId",
            },
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    });

    return StudentTeacher_Request;
};
