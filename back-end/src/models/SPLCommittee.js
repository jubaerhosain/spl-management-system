"use strict";

export default (options) => {
    const { sequelize, DataTypes, Sequelize } = options;
    const SPLCommittee = sequelize.define("SPLCommittees", {
        committeeId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "SPLs",
                key: "splId",
            },
        },
        head: {
            type: DataTypes.UUID,
            references: {
                model: "Teachers",
                key: "teacherId",
            },
        },
        manager: {
            type: DataTypes.UUID,
            references: {
                model: "Teachers",
                key: "teacherId",
            },
        },
    });

    SPLCommittee.associate = (models) => {
        // Teacher - SPLCommittee [one to many]
        SPLCommittee.belongsTo(models.Teacher, {
            as: "Manager",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "manager",
        });

        // Teacher - SPLCommittee [one to many]
        SPLCommittee.belongsTo(models.Teacher, {
            as: "Head",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "head",
        });

        // Teacher - SPLCommittee [many to many]
        SPLCommittee.belongsToMany(models.Teacher, {
            through: models.CommitteeMember,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });
    };

    return SPLCommittee;
};
