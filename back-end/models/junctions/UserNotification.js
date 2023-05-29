"use strict";

export default (sequelize, DataTypes) => {
    const UserNotification = sequelize.define("UserNotifications", {
        noticeId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Notifications",
                key: "noticeId",
            },
        },
        receiverId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Users",
                key: "userId",
            },
        },
    });

    return UserNotification;
};
