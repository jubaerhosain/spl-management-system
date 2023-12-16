"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const ProjectStudent_Contributor = sequelize.define("ProjectStudent_Contributors", {
        projectId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Projects",
                key: "projectId",
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

    return ProjectStudent_Contributor;
};
