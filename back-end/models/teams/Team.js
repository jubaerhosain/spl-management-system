"use strict";

export default (sequelize, DataTypes) => {
    const Team = sequelize.define("Teams", {
        teamId: {
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
        teamName: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
    });

    Team.associate = (models) => {
        // SPL - Team [one to many]
        Team.belongsTo(models.SPL, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });

        // Team - Student [many to many]
        Team.belongsToMany(models.Student, {
            as: "TeamMembers",
            through: models.StudentTeam,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teamId",
        });

        // As Request Sender
        // Team - Teacher [many to many]
        Team.belongsToMany(models.Teacher, {
            as: "RequestedTeachers",
            through: models.TeamRequest,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teamId",
        });
    };

    return Team;
};
