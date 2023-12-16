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
            allowNull: true,
            references: {
                model: "Teachers",
                key: "teacherId",
            },
            comment: "Supervisor",
        },
    });

    return SPLCommitteeTeacher_Member;
};
