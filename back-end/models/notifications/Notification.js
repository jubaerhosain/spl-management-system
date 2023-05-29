"use strict";

export default (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notifications", {
        noticeId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "userId",
            },
        },
        title: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        reads: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    });

    Notification.associate = (models) => {
        // User - Notification [many to many]
        Notification.belongsToMany(models.User, {
            as: "Receivers",
            through: models.UserNotification,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "noticeId",
        });
    };

    return Notification;
};
