"use strict";

export default (sequelize, DataTypes) => {
    const PresentationMark = sequelize.define("PresentationMarks", {
        presentationMarkId: {
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
        presentationId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Presentations",
                key: "presentationId",
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
        mark: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    });

    PresentationMark.associate = (models) => {
        // Mark - PresentationMark [one to many]
        PresentationMark.belongsTo(models.Mark, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "markId",
        });

        // Presentation - PresentationMark [one to many]
        PresentationMark.belongsTo(models.Presentation, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "presentationId",
        });

        // Teacher - PresentationMark [one to many]
        PresentationMark.belongsTo(models.Teacher, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teacherId",
        });
    };

    return PresentationMark;
};
