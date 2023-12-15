"use strict";

export default (options) => {
    const { sequelize, DataTypes, Sequelize } = options;
    const Project = sequelize.define("Projects", {
        projectId: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        splId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "SPLs",
                key: "splId",
            },
        },
        teacherId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Teachers",
                key: "teacherId",
            },
            comment: "Supervisor for team members also have in the supervisors relationship, did intentionally",
        },
        projectName: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        projectType: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [["individual", "team"]],
            },
        },
        github: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        liveDemo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        documentationProgress: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        codeProgress: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        weeklyProgress: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    });

    Project.associate = (models) => {
        // SPL - Project [one to many]
        Project.belongsTo(models.SPL, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });

        // Teacher - Project [one to many]
        Project.belongsTo(models.Teacher, {
            as: "Supervisor",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teacherId",
        });

        // Student - Project [many to many]
        Project.belongsToMany(models.Student, {
            through: models.ProjectContributor,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "projectId",
        });
    };

    return Project;
};
