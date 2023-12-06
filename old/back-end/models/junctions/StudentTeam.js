"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const StudentTeam = sequelize.define("StudentTeams", {
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

    return StudentTeam;
};
