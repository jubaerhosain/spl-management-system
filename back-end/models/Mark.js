"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const Mark = sequelize.define("Marks", {
        studentId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Students",
                key: "studentId",
            },
        },
        splId: {
            type: DataTypes.UUID,
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
    };

    return Mark;
};
