"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const CommitteeMember = sequelize.define("CommitteeMembers", {
        committeeId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "SPLCommittees",
                key: "committeeId",
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

    return CommitteeMember;
};
