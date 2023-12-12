"use strict";

export default (options) => {
    const { sequelize, DataTypes, Sequelize } = options;
    const Team = sequelize.define("Teams", {
        teamId: {
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
            allowNull: true,
            references: {
                model: "Teachers",
                key: "teacherId",
            },
            comment: "Supervisor for team members also have in the student-teacher relationship, did intentionally",
        },
        teamName: {
            type: DataTypes.STRING(40),
            allowNull: false,
            comment: "Team belongs to same SPL cannot have duplicate names",
        },
        details: {
            type: DataTypes.TEXT,
        },
    });

    Team.associate = (models) => {
        // SPL - Team [one to many]
        Team.belongsTo(models.SPL, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });

        // Teacher - Team [one to many]
        Team.belongsTo(models.Teacher, {
            as: "Supervisor",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teacherId",
        });

        // Team - Student [many to many]
        Team.belongsToMany(models.Student, {
            through: models.TeamMember,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teamId",
        });

        // Team - TeamMember [One to many]
        Team.hasMany(models.TeamMember, {
            as: "Members",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teamId",
        });

        // Team - Teacher [many to many] as Request Sender
        Team.belongsToMany(models.Teacher, {
            as: "RequestedTeachers",
            through: models.SupervisorRequest,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teamId",
        });
    };

    return Team;
};
