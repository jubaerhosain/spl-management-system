"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const ProjectStudent = sequelize.define("ProjectStudents", {
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
        projectId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Projects",
                key: "projectId",
            },
        },
    });

    return ProjectStudent;
};
