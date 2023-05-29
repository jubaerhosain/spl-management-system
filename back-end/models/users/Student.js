"use strict";

export default (sequelize, DataTypes, Op) => {
    const Student = sequelize.define("Students", {
        studentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Users",
                key: "userId",
            },
        },
        rollNo: {
            type: DataTypes.STRING(9),
            allowNull: false,
            unique: true,
            validate: {
                is: /^BSSE-[0-9]{4}$/,
            },
            comment: "Roll format: 'BSSE-1255'",
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
            type: DataTypes.STRING(3),
            validate: {
                isIn: [["1st", "2nd", "3rd", "4th"]],
            },
            comment: "NULL will be treated as unenrolled",
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
            through: models.StudentSupervisor,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });

        // Student - Project [many to many]
        Student.belongsToMany(models.Project, {
            through: models.StudentProject,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });

        // Team - Student [many to many]
        Student.belongsToMany(models.Team, {
            through: models.StudentTeam,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });

        // Student - Mark [one to many]
        Student.hasMany(models.Mark, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });

        // As Request Sender
        // Student - Teacher [many to many]
        Student.belongsToMany(models.Teacher, {
            as: "RequestedTeachers",
            through: models.StudentRequest,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });
    };

    return Student;
};
