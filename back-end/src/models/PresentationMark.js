"use strict";

export default (options) => {
    const { sequelize, DataTypes, Sequelize } = options;
    const PresentationMark = sequelize.define("PresentationMarks", {
        presentationMarkId: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            unique: true
        },
        presentationId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {            
                model: "Presentations",
                key: "presentationId",
            },
        },
        studentId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Students",
                key: "studentId",
            },
        },
        teacherId: {
            type: DataTypes.UUID,
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
        // Student - PresentationMark [one to many]
        PresentationMark.belongsTo(models.Student, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
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
