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
