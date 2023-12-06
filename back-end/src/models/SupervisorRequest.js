"use strict";

export default (options) => {
    const { sequelize, DataTypes, Sequelize } = options;
    const SupervisorRequest = sequelize.define("SupervisorRequests", {
        requestId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        studentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "Students",
                key: "studentId",
            },
        },
        teamId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "Teams",
                key: "teamId",
            },
        },
        teacherId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Teachers",
                key: "teacherId",
            },
        },
        splId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "SPLs",
                key: "splId",
            },
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    });

    return SupervisorRequest;
};
