"use strict";

export default (options) => {
    const { sequelize, DataTypes, Sequelize } = options;
    const Committee = sequelize.define("Committees", {
        committeeId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "SPLs",
                key: "splId",
            },
        },
        committeeHead: {
            type: DataTypes.UUID,
            references: {
                model: "Teachers",
                key: "teacherId",
            },
        },
    });

    Committee.associate = (models) => {
        // SPL - Committee
        Committee.belongsTo(models.SPL, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "committeeId",
        });

        // Teacher - Committee [one to many]
        Committee.belongsTo(models.Teacher, {
            as: "CommitteeHead",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "committeeHead",
        });

        // Teacher - Committee [many to many]
        Committee.belongsToMany(models.Teacher, {
            as: "CommitteeMembers",
            through: models.CommitteeTeacher_Member,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teacherId",
        });
    };

    return Committee;
};
