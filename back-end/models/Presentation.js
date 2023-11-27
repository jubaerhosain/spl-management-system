"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const Presentation = sequelize.define("Presentations", {
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
            primaryKey: ["presentationNo", "splId"],
        });
    };

    return Presentation;
};
