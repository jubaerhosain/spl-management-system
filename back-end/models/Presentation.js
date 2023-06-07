"use strict";

export default (sequelize, DataTypes) => {
    const Presentation = sequelize.define("Presentations", {
        presentationId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        splId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "SPLs",
                key: "splId",
            },
        },
        presentationNo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    });

    // Add a beforeCreate hook to make the presentationNo start from 1 for each splId
    Presentation.beforeCreate(async (presentation, options) => {
        const maxPresentationNo = await Presentation.max("presentationNo", {
            where: {
                splId: presentation.splId,
            },
        });

        presentation.presentationNo = maxPresentationNo ? maxPresentationNo + 1 : 1;
    });

    Presentation.associate = (models) => {
        // SPL - Presentation [one to many]
        Presentation.belongsTo(models.SPL, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
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
