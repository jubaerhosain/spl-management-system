"use strict";

export default (options) => {
    const { sequelize, DataTypes, Sequelize } = options;
    const SPL = sequelize.define("SPLs", {
        splId: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        splManager: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "Teachers",
                key: "teacherId",
            },
        },
        splName: {
            type: DataTypes.STRING(4),
            allowNull: false,
            validate: {
                isIn: [["spl1", "spl2", "spl3"]],
            },
        },
        academicYear: {
            type: DataTypes.STRING(4),
            allowNull: false,
            validate: {
                is: /^[0-9]{4}$/,
            },
            comment: "Academic year of SPL. Format: '2020'",
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: "Indicates current SPL is running or ended",
        },
    });

    SPL.associate = (models) => {
        // SPL - Committee
        SPL.hasOne(models.Committee, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "committeeId",
        });

        // Student - SPL [many to many]
        SPL.belongsToMany(models.Student, {
            through: models.StudentSPL_Enrollment,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });

        // Teacher - SPL [one to many] as SPL Manager
        SPL.belongsTo(models.Teacher, {
            as: "SPLManager",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splManager",
        });

        // SPL - Project [one to many]
        SPL.hasMany(models.Project, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });

        // SPL - Team [one to many]
        SPL.hasMany(models.Team, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });

        // SPL - SPLMark [one to many]
        SPL.hasMany(models.SPLMark, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });

        // SPL - ContinuousMark [one to many]
        SPL.hasMany(models.ContinuousMark, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });

        // SPL - Presentation [one to many]
        SPL.hasMany(models.Presentation, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });

        // SPL - SupervisorRequest [one to many]
        SPL.hasMany(models.SupervisorRequest, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });
    };

    return SPL;
};
