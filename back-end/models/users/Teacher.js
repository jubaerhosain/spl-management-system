"use strict";

export default (sequelize, DataTypes) => {
    const Teacher = sequelize.define("Teachers", {
        teacherId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Users",
                key: "userId",
            },
        },
        designation: {
            type: DataTypes.STRING(30),
        },
        rank: {
            type: DataTypes.INTEGER,
        },
        available: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: "Teacher is available to be supervisor or not",
        },
    });

    Teacher.associate = (models) => {
        // User - Teacher [one to one]
        Teacher.belongsTo(models.User, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teacherId",
        });

        // Teacher - SPL [one to many] as SPL Manager
        Teacher.hasMany(models.SPL, {
            as: "ManagedSPLs",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "splManager",
        });

        // Teacher - SPL [one to many] as Committee Head
        Teacher.hasMany(models.SPL, {
            as: "LedSPLs",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "committeeHead",
        });

        // Teacher - SPL [many to many]
        Teacher.belongsToMany(models.SPL, {
            through: models.TeacherSPL_CommitteeMember,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teacherId",
        });

        // Student - Teacher [many to many] as Supervisor
        Teacher.belongsToMany(models.Student, {
            as: "SupervisedStudents",
            through: models.StudentSupervisor,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teacherId",
        });

        // SPL - Teacher [many to many] as Presentation Evaluator
        Teacher.belongsToMany(models.SPL, {
            through: models.TeacherSPL_PresentationEvaluator,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teacherId",
        });

        // Teacher - PresentationMark [one to many] as PresentationEvaluator
        Teacher.hasMany(models.PresentationMark, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teacherId",
        });

        // Student - Teacher [many to many] as Request Receiver
        Teacher.belongsToMany(models.Student, {
            as: "RequestedStudents",
            through: models.StudentRequest,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teacherId",
        });

        // Team - Teacher [many to many] as Request Receiver
        Teacher.belongsToMany(models.Team, {
            as: "RequestedTeams",
            through: models.TeamRequest,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teacherId",
        });
    };

    return Teacher;
};
