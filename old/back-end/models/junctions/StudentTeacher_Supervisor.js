"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const StudentTeacher_Supervisor = sequelize.define("StudentTeacher_Supervisors", {
        teacherId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Teachers",
                key: "teacherId",
            },
        },
        studentId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Students",
                key: "studentId",
            },
        },
        splId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "SPLs",
                key: "splId",
            },
        },
    });

    return StudentTeacher_Supervisor;
};
