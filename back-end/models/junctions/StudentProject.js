"use strict";

export default (sequelize, DataTypes) => {
    const StudentProject = sequelize.define("StudentProjects", {
        studentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Students",
                key: "studentId",
            },
        },
        projectId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Projects",
                key: "projectId",
            },
        },
    });

    return StudentProject;
};
