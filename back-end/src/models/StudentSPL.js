"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const StudentSPL = sequelize.define("StudentSPLs", {
        splId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "SPLs",
                key: "splId",
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

    return StudentSPL;
};
