"use strict";

// [Committee Members]
export default (sequelize, DataTypes, Op) => {
    const TeacherSPL_CommitteeMember = sequelize.define("TeacherSPL_CommitteeMembers", {
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

    return TeacherSPL_CommitteeMember;
};