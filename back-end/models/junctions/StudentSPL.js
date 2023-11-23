"use strict";

export default (sequelize, DataTypes) => {
    const StudentSPL = sequelize.define("StudentSPLs", {
        studentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Students",
                key: "studentId",
            },
        },
        splId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "SPLs",
                key: "splId",
            },
        },
        documentationProgress: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        codeProgress: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        weeklyProgress: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    });

    return StudentSPL;
};
