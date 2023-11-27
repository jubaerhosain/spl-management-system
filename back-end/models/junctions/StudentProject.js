"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const StudentProject = sequelize.define("StudentProjects", {
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
            primaryKey: true,
            references: {
                model: "Projects",
                key: "projectId",
            },
        },
    });

    return StudentProject;
};
