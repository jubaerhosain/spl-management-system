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
            comment: "Supervisor for team members also have in the student-teacher relationship, did intentionally",
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
                isIn: [["individual", "group"]],
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

        // Student - Project [many to many]
        Project.belongsToMany(models.Student, {
            through: models.StudentProject_ProjectContributor,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "projectId",
        });
    };

    return Project;
};
