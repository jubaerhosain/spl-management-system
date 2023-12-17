"use strict";

// StudentTeam
export default (options) => {
    const { sequelize, DataTypes } = options;
    const TeamStudent_Member = sequelize.define("TeamStudent_Members", {
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

    TeamStudent_Member.associate = (models) => {
        // Team - TeamStudent_Member [one to many] // for team bulkCreate query simplicity
        TeamStudent_Member.belongsTo(models.Team, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teamId",
        });
    };

    return TeamStudent_Member;
};
