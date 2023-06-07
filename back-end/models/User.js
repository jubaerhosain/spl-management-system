"use strict";

export default (sequelize, DataTypes, Op) => {
    const User = sequelize.define(
        "Users",
        {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: DataTypes.STRING(40),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING(72),
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(15),
            },
            userType: {
                type: DataTypes.STRING(10),
                allowNull: false,
                validate: {
                    isIn: [["admin", "student", "teacher"]],
                },
            },
            name: {
                type: DataTypes.STRING(30),
            },
            gender: {
                type: DataTypes.STRING(6),
                validate: {
                    isIn: [["male", "female", "other"]],
                },
            },
            avatar: {
                type: DataTypes.STRING(50),
                comment: "File name format 'userId-currentTime.extension'",
            },
            details: {
                type: DataTypes.TEXT,
            },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                comment: "User account is active or not",
            },
        },
        {
            initialAutoIncrement: 1000,
        }
    );

    User.associate = (models) => {
        // User - Student [one to one]
        User.hasOne(models.Student, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "studentId",
        });

        // User - Teacher [one to one]
        User.hasOne(models.Teacher, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "teacherId",
        });

        // User - Notification [many to many]
        User.belongsToMany(models.Notification, {
            through: models.UserNotification,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "receiverId",
        });
    };

    return User;
};
