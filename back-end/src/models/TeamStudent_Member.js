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

    return TeamStudent_Member;
};
