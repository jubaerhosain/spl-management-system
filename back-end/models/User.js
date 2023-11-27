"use strict";

export default (options) => {
    const { sequelize, DataTypes, Sequelize } = options;
    const User = sequelize.define(
        "Users",
        {
            userId: {
                type: DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
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
            defaultScope: {
                where: {
                    active: true,
                },
                attributes: {
                    exclude: ["password"],
                },
            },
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

        // User - Notice [one to many]
        User.hasMany(models.Notification, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "receiverId",
        });

        // User - OTP [one to one]
        User.hasOne(models.OTP, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "email",
            sourceKey: "email",
        });
    };

    return User;
};
