"use strict";

export default (sequelize, DataTypes) => {
    const Project = sequelize.define("Projects", {
        projectId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        splId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "SPLs",
                key: "splId",
            },
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
    });

    Project.associate = (models) => {
        // SPL - Project [one to many]
        Project.belongsTo(models.SPL, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });

        // Student - Project [many to many]
        Project.belongsToMany(models.Student, {
            through: models.StudentProject,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "projectId",
        });
    };

    return Project;
};
