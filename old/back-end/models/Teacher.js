"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const Teacher = sequelize.define("Teachers", {
        teacherId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Users",
                key: "userId",
            },
        },
        designation: {
            type: DataTypes.STRING(30),
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
            foreignKey: "manager",
        });

        // Teacher - SPL [one to many] as Committee Head
        Teacher.hasMany(models.SPL, {
            as: "LeadedSPLs",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "head",
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
            through: models.StudentTeacher_Supervisor,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teacherId",
        });

        // Teacher - Team [one to many]
        Teacher.hasMany(models.Team, {
            as: "SupervisedTeams",
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
            through: models.StudentTeacher_Request,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teacherId",
        });

        // Team - Teacher [many to many] as Request Receiver
        Teacher.belongsToMany(models.Team, {
            as: "RequestedTeams",
            through: models.TeamTeacher_Request,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teacherId",
        });
    };

    return Teacher;
};
