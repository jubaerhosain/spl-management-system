"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const TeacherSPL_PresentationEvaluator = sequelize.define("TeacherSPL_PresentationEvaluators", {
        splId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "SPLs",
                key: "splId",
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
    });

    return TeacherSPL_PresentationEvaluator;
};
