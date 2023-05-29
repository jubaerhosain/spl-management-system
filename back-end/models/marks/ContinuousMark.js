"use strict";

export default (sequelize, DataTypes, Op) => {
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
        week: {
            type: DataTypes.STRING(10),
            primaryKey: true,
            validate: {
                is: /^Week [1-9]{1,2}$/,
            },
            comment: "Week format 'Week 2'",
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
