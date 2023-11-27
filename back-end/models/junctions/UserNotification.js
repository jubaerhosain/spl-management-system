"use strict";

export default (options) => {
    const { sequelize, DataTypes } = options;
    const StudentProject = sequelize.define("UserNotifications", {
        userId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Users",
                key: "userId",
            },
        },
        notificationId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: "Notifications",
                key: "notificationId",
            },
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    });

    return StudentProject;
};
