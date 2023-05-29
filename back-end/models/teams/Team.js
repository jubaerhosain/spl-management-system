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
            comment: "Team belongs to same SPL cannot have duplicate names",
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

        // Team - Teacher [many to many] as Request Sender
        Team.belongsToMany(models.Teacher, {
            as: "RequestedTeachers",
            through: models.TeamTeacher_Request,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teamId",
        });
    };

    return Team;
};
