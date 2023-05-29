"use strict";

export default (sequelize, DataTypes) => {
    const TeamTeacher_Request = sequelize.define("TeamTeacher_Requests", {
        teamId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Teams",
                key: "teamId",
            },
        },
        teacherId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Teachers",
                key: "teacherId",
            },
        },
    });

    return TeamTeacher_Request;
};
