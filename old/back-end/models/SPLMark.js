"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const SPLMark = sequelize.define("SPLMarks", {
        studentId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Students",
                key: "studentId",
            },
        },
        splId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "SPLs",
                key: "splId",
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
        // Student - SPLMark [one to many]
        SPLMark.belongsTo(models.Student, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });

        // SPL - SPLMark [one to many]
        SPLMark.belongsTo(models.SPL, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });
    };

    return SPLMark;
};
