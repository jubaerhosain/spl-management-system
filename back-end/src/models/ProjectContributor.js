"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const ProjectContributor = sequelize.define("ProjectContributors", {
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

    return ProjectContributor;
};
