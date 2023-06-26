"use strict";

export default (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notifications", {
        notificationId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: "studentId for student_request, teamId for team_request and null for appoint",
        },
        receiverId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "userId",
            },
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date(),
        },
        notificationType: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [["student_request", "team_request", "appoint"]],
            },
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    });

    Notification.associate = (models) => {
        // User - Notification [many to many]
        Notification.belongsTo(models.User, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "receiverId",
        });
    };

    return Notification;
};
