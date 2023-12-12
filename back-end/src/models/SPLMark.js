"use strict";

export default (options) => {
    const { sequelize, DataTypes, Sequelize } = options;
    const SPLMark = sequelize.define("SPLMarks", {
        splMarkId: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            unique: true
        },
        splId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "SPLs",
                key: "splId",
            },
        },
        studentId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Students",
                key: "studentId",
            },
        },
        supervisorMark: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        codingMark: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
    });

    SPLMark.associate = (models) => {
        SPLMark.belongsTo(models.SPL, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId"
        });

        SPLMark.belongsTo(models.Student, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId"
        });
    }

    return SPLMark;
};
