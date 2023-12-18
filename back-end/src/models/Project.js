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
        supervisorId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Teachers",
                key: "teacherId",
            },
            comment: "Supervisor for team members also have in the StudentSPL relationship, did intentionally",
        },
        teamId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "Teams",
                key: "teamId",
            },
            comment: "If project is a team project",
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
            foreignKey: "supervisorId",
        });

        // Team - Project [one to one] // make one to many if needed later
        Project.belongsTo(models.Team, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teamId",
        });

        // Student - Project [many to many]
        Project.belongsToMany(models.Student, {
            as: "ProjectContributors",
            through: models.ProjectStudent_Contributor,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "projectId",
        });
    };

    return Project;
};
