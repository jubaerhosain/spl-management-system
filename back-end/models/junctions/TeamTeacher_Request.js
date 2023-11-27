"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const TeamTeacher_Request = sequelize.define("TeamTeacher_Requests", {
        teamId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Teams",
                key: "teamId",
            },
        },
        teacherId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Teachers",
                key: "teacherId",
            },
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    });

    return TeamTeacher_Request;
};
