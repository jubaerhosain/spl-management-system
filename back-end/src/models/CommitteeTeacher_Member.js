"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const CommitteeTeacher_Member = sequelize.define("CommitteeTeacher_Members", {
        committeeId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Committees",
                key: "committeeId",
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

    return CommitteeTeacher_Member;
};
