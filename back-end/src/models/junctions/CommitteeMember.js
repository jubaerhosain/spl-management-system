"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const CommitteeMember = sequelize.define("CommitteeMembers", {
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

    return CommitteeMember;
};
