"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const StudentSPL_Enrollment = sequelize.define("StudentSPL_Enrollments", {
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

    return StudentSPL_Enrollment;
};
