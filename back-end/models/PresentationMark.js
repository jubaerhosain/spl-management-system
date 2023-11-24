"use strict";

export default (sequelize, DataTypes) => {
    const PresentationMark = sequelize.define("PresentationMarks", {
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
            defaultValue: 0,
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
