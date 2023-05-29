"use strict";

// Presentation Evaluator of SPL
export default (sequelize, DataTypes) => {
    const TeacherSPL_PresentationEvaluator = sequelize.define("TeacherSPL_PresentationEvaluators", {
        splId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "SPLs",
                key: "splId",
            },
        },
        teacherId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Teachers",
                key: "teacherId",
            },
        },
    });

    return TeacherSPL_PresentationEvaluator;
};
