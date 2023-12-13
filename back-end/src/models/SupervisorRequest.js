"use strict";

export default (options) => {
    const { sequelize, DataTypes, Sequelize } = options;
    const SupervisorRequest = sequelize.define("SupervisorRequests", {
        requestId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
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

    SupervisorRequest.associate = (models) => {
        // Teacher - SupervisorRequest [One to many]
        SupervisorRequest.belongsTo(models.Teacher, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teacherId",
        });

        // Student - SupervisorRequest [One to many]
        SupervisorRequest.belongsTo(models.Student, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });

        // Team - SupervisorRequest [One to many]
        SupervisorRequest.belongsTo(models.Team, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teamId",
        });

        // SPL - SupervisorRequest [one to many]
        SupervisorRequest.belongsTo(models.SPL, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });
    };

    return SupervisorRequest;
};
