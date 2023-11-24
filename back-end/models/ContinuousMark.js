"use strict";

export default (sequelize, DataTypes, Op, Sequelize) => {
    const ContinuousMark = sequelize.define("ContinuousMarks", {
        markId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Marks",
                key: "markId",
            },
        },
        weekName: {
            type: DataTypes.STRING(6),
            primaryKey: true,
            validate: {
                is: /^week-[0-9]{1,2}$/,
            },
            comment: "Week-1",
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
