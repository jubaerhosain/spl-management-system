"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const SPLCommitteeTeacher_Member = sequelize.define("PresentationTeacher_Evaluators", {
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

    return SPLCommitteeTeacher_Member;
};
