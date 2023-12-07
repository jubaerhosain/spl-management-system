"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    // a student can have only one supervisor for a specific SPL
    const Supervisor = sequelize.define("Supervisors", {
        teacherId: {
            type: DataTypes.UUID,
            allowNull: false,
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

    return Supervisor;
};
