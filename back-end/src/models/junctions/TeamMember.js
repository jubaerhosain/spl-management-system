"use strict";

// StudentTeam
export default (options) => {
    const { sequelize, DataTypes } = options;
    const TeamMember = sequelize.define("TeamMembers", {
        teamId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Teams",
                key: "teamId",
            },
        },
        studentId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Students",
                key: "studentId",
            },
        },
    });

    TeamMember.associate = (models) => {
        // Team - TeamMember [One to many]
        TeamMember.belongsTo(models.Team, {
            as: "Members",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teamId",
        });
    };

    return TeamMember;
};
