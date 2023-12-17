"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const StudentSPL_Enrollment = sequelize.define("StudentTeacher_Supervisors", {
        splId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "SPLs",
                key: "splId",
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
        teacherId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Teachers",
                key: "teacherId",
            },
            comment: "Supervisor",
        },
    });

    return StudentSPL_Enrollment;
};
