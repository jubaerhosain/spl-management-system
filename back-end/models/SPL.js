"use strict";

export default (options) => {
    const { sequelize, DataTypes, Sequelize } = options;
    const SPL = sequelize.define(
        "SPLs",
        {
            splId: {
                type: DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            academicYear: {
                type: DataTypes.STRING(8),
                allowNull: false,
                validate: {
                    is: /^[0-9]{4}$/,
                },
                comment: "Academic year of SPL. Format: '2020'",
            },
            splName: {
                type: DataTypes.STRING(4),
                allowNull: false,
                validate: {
                    isIn: [["spl1", "spl2", "spl3"]],
                },
            },
            splManager: {
                type: DataTypes.UUID,
                references: {
                    model: "Teachers",
                    key: "teacherId",
                },
            },
            committeeHead: {
                type: DataTypes.UUID,
                references: {
                    model: "Teachers",
                    key: "teacherId",
                },
            },
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                comment: "Indicates current SPL is running or not",
            },
        },
        {
            defaultScope: {
                where: {
                    active: true,
                },
            },
        }
    );

    SPL.associate = (models) => {
        // Teacher - SPL [one to many]
        SPL.belongsTo(models.Teacher, {
            as: "SPLManager",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splManager",
        });

        // Teacher - SPL [one to many]
        SPL.belongsTo(models.Teacher, {
            as: "CommitteeHead",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "committeeHead",
        });

        // Teacher - SPL [many to many]
        SPL.belongsToMany(models.Teacher, {
            as: "CommitteeMembers",
            through: models.TeacherSPL_CommitteeMember,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });

        // Student - SPL [many to many]
        SPL.belongsToMany(models.Student, {
            through: models.StudentSPL,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });

        // SPL - Teacher [many to many]
        SPL.belongsToMany(models.Teacher, {
            as: "PresentationEvaluators",
            through: models.TeacherSPL_PresentationEvaluator,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
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

        // SPL - Presentation [one to many]
        SPL.hasMany(models.Presentation, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splId",
        });

        // SPL - Mark [one to many]
        SPL.hasMany(models.Mark, {
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
    };

    return SPL;
};
