"use strict";

export default (options) => {
    const { sequelize, DataTypes, Sequelize } = options;
    const Presentation = sequelize.define("Presentations", {
        presentationId: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
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
        presentationNo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        details: {
            type: DataTypes.TEXT,
        },
    });

    Presentation.associate = (models) => {
        // SPL - Presentation [one to many]
        Presentation.belongsTo(models.SPL, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });

        // Presentation - Teacher [many to many]
        Presentation.belongsToMany(models.Teacher, { 
            through: models.PresentationEvaluator,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "presentationId",
        });

        // Presentation - PresentationMark [one to many]
        Presentation.hasMany(models.PresentationMark, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "presentationId",
        });
    };

    return Presentation;
};
