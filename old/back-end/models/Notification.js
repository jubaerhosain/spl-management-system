"use strict";

export default (options) => {
    const { sequelize, DataTypes, Sequelize } = options;
    const Notification = sequelize.define("Notifications", {
        notificationId: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Users",
                key: "userId",
            },
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
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });

    Notification.associate = (models) => {
        // User - Notification [one to many]
        Notification.belongsTo(models.User, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: "userId",
        });
    };

    return Notification;
};
