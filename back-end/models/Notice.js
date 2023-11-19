"use strict";

export default (sequelize, DataTypes) => {
    const Notice = sequelize.define("Notices", {
        noticeId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        noticeType: {
            type: DataTypes.STRING,
            validate: {
                isIn: [["spl1", "spl2", "spl3", "public"]],
            },
            comment: "committee creation, presentation event"
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date(),
        },
    });

    return Notice;
};
