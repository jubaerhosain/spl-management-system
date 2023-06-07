"use strict";

export default (sequelize, DataTypes) => {
    const Mark = sequelize.define("Marks", {
        markId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            autoIncrement: true,
        },
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

    Mark.associate = (models) => {
        // Student - Mark [one to many]
        Mark.belongsTo(models.Student, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });

        // SPL - Mark [one to many]
        Mark.belongsTo(models.SPL, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });

        // Mark - PresentationMark [one to many]
        Mark.hasMany(models.PresentationMark, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            sourceKey: "markId",
            foreignKey: "markId",
        });

        // Mark - ContinuousMark [one to many]
        Mark.hasMany(models.ContinuousMark, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            sourceKey: "markId",
            foreignKey: "markId",
        });
    };

    return Mark;
};
