"use strict";

export default (sequelize, DataTypes, Op, Sequelize) => {
    const ContinuousMark = sequelize.define("ContinuousMarks", {
        studentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Students",
                key: "studentId",
            },
        },
        splId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "SPLs",
                key: "splId",
            },
        },
        classNo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        mark: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
    });

    ContinuousMark.associate = (models) => {
        // Student - ContinuousMark [one to many]
        ContinuousMark.belongsTo(models.Student, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });

        // SPL - ContinuousMark [one to many]
        ContinuousMark.belongsTo(models.SPL, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });
    };

    return ContinuousMark;
};
