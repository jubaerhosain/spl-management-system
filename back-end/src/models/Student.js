"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const Student = sequelize.define("Students", {
        studentId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Users",
                key: "userId",
            },
        },
        rollNo: {
            type: DataTypes.STRING(4),
            allowNull: false,
            unique: true,
            validate: {
                is: /^[0-9]{4}$/,
            },
            comment: "Roll format: '1255'",
        },
        registrationNo: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
            validate: {
                is: /^[0-9]{10}$/,
            },
        },
        batch: {
            type: DataTypes.STRING(2),
            allowNull: false,
            validate: {
                is: /^[0-9]{2}$/,
            },
            comment: "Batch format: '12'",
        },
        session: {
            type: DataTypes.STRING(7),
            allowNull: false,
            validate: {
                is: /^[0-9]{4}-[0-9]{2}$/,
            },
            comment: "Admission session of the students. Format: '2018-19'",
        },
        curriculumYear: {
            type: DataTypes.STRING(5),
            validate: {
                isIn: [["1st", "2nd", "3rd", "4th", "graduated", "none"]],
            },
            comment: "'none' will be treated as unenrolled",
        },
    });

    Student.associate = (models) => {
        // User - Student [one to one]
        Student.belongsTo(models.User, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });

        // Student - SPL [many to many]
        Student.belongsToMany(models.SPL, {
            through: models.StudentSPL,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });

        // Student - Teacher [many to many]
        Student.belongsToMany(models.Teacher, {
            as: "Supervisors",
            through: models.StudentSPL,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });

        // Student - Project [many to many]
        Student.belongsToMany(models.Project, {
            through: models.ProjectContributor,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });

        // Team - Student [many to many]
        Student.belongsToMany(models.Team, {
            through: models.TeamMember,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });

        // Student - PresentationMark [one to many]
        Student.hasMany(models.PresentationMark, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });

        // Student - SPLMark [one to many]
        Student.hasMany(models.SPLMark, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });

        // Student - ContinuousMark [one to many]
        Student.hasMany(models.ContinuousMark, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });

        // Student - SupervisorRequest [One to many]
        Student.hasMany(models.SupervisorRequest, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });
    };

    return Student;
};
