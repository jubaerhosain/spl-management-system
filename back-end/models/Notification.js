"use strict";

export default (options) => {
    const { sequelize, DataTypes, Sequelize } = options;
    const Notification = sequelize.define("Notifications", {
        notificationId: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date(),
        },
        type: {
            type: DataTypes.STRING(8),
            allowNull: false,
            validate: {
                isIn: [["info", "warning", "success", "error"]],
            },
        },
    });

    Notification.associate = (models) => {
        // User - Notification [many to many]
        Notification.belongsToMany(models.User, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            through: models.UserNotification,
            foreignKey: "notificationId",
        });
    };

    return Notification;
};
