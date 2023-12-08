"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const PresentationEvaluator = sequelize.define("PresentationEvaluators", {
        presentationId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Presentations",
                key: "presentationId",
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

    return PresentationEvaluator;
};
