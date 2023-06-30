"use strict";

export default (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notifications", {
        notificationId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
                isIn: [["other"]],
            },
            comment:
                "appoint committee person, student added to spl, allocated supervisor, presentation event, posted a notice",
        },
        isRead: {
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
