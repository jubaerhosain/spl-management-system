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
            github: {
                type: DataTypes.STRING(100),
            },
            linkedin: {
                type: DataTypes.STRING(100),
            },
            facebook: {
                type: DataTypes.STRING(100),
            },
            website: {
                type: DataTypes.STRING(100),
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
                type: DataTypes.STRING(100),
                comment: "store in object storage",
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

        // User - Notification [one to many]
        User.hasMany(models.Notification, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "userId",
        });

        // User - OTP [one to one]
        User.hasOne(models.OTP, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            sourceKey: "email",
            foreignKey: "email",
        });
    };

    return User;
};
