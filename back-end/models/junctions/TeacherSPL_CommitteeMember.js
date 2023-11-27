"use strict";

// [Committee Members]
export default (options) => {
    const { sequelize, DataTypes } = options;
    const TeacherSPL_CommitteeMember = sequelize.define("TeacherSPL_CommitteeMembers", {
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

    return TeacherSPL_CommitteeMember;
};
