"use strict";

export default (sequelize, DataTypes, Op, Sequelize) => {
    const ContinuousMark = sequelize.define("ContinuousMarks", {
        continuousMarkId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            autoIncrement: true,
        },
        markId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Marks",
                key: "markId",
            },
        },
        date: {
            type: DataTypes.DATEONLY,
            primaryKey: true,
            defaultValue: Sequelize.NOW,
        },
        mark: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
    });

    ContinuousMark.associate = (models) => {
        // Mark - ContinuousMark [one to many]
        ContinuousMark.belongsTo(models.Mark, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "markId",
        });
    };

    return ContinuousMark;
};
