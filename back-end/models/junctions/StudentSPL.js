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
    });

    return StudentSPL;
};
