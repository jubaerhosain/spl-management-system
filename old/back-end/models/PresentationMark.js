"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const PresentationMark = sequelize.define("PresentationMarks", {
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
            // references: {            // don't works if I use those references
            //     model: "Presentations",
            //     key: "splId",
            // },
        },
        presentationNo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            // references: {
            //     model: "Presentations",
            //     key: "presentationNo",
            // },
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
            foreignKey: ["presentationNo", "splId"],
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
