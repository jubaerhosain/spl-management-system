"use strict";

export default (sequelize, DataTypes) => {
    const StudentTeam = sequelize.define("StudentTeams", {
        teamId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Teams",
                key: "teamId",
            },
        },
        studentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Students",
                key: "studentId",
            },
        },
    });

    return StudentTeam;
};
